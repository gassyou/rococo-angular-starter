import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from "@delon/theme";
import { BehaviorSubject, Observable } from "rxjs";
import { SearchParams } from "./search-params.interface";
import { filter, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class CRUD {

  public searchUrl: string = '';
  public addUrl: string = '';
  public deleteUrl: string = '';
  public updateUrl: string = '';
  public exportUrl: string = '';

  public params: SearchParams = {
    currentPage: 1,
    pageSize: 10,
    sortName: null,
    sortValue: null,
  };

  private _search$ = new BehaviorSubject<SearchParams>(null);
  public datasource$ = this._search$.asObservable()
                        .pipe(filter(params => params !== null))
                        .pipe(switchMap((params) => { return this.http.post(this.searchUrl, params);}));

  constructor(
    private http: _HttpClient,
    private message: NzMessageService
    ) {}


  public search(query?:SearchParams) {
    if(query) {
      this.params = {... query};
    }
    this._search$.next(this.params);
  }


  public add(param: any): Observable<any> {
    return this.http.post(this.addUrl, param).pipe(
      map((response)=>{

        if(response['meta']['success']) {
          this.message.info('添加成功');
          this.search();
          return response;
        } else {
          this.message.error(response['meta']['message']);
          return false;
        }
      })
    );
  }

  public update(param: any): Observable<any> {
    return this.http.post(this.updateUrl, param).pipe(
      map((response)=>{
        if(response['meta']['success']) {
          this.message.info('修改成功');
          this.search();
          return response;
        } else {
          this.message.error(response['meta']['message']);
          return false;
        }
      })
    );
  }

  public delete(id: number): Observable<any> {
    return this.http.post(`${this.deleteUrl}/${id}`).pipe(
      map((response)=>{
        if(response['meta']['success']) {
          this.message.info('删除成功');
          this.search();
          return response;
        } else {
          this.message.error(response['meta']['message']);
          return false;
        }
      })
    );
  }

  public export(query): Observable<any> {
    return this.http.post('/gateway/export', query, null, {responseType: 'arraybuffer'});
  }

  public checkUnique(checkUrl: string, params:any): Observable<any> {
    return this.http.post(checkUrl, params).pipe(
      map(result => {
        if(result['meta']['success']) {
          return null;
        } else {
          return {duplicated: {msg: result['meta']['message']}};
        }
      })
    );
  }

}
