import { NzMessageService } from 'ng-zorro-antd/message';
import { _HttpClient } from "@delon/theme";
import { BehaviorSubject, Observable } from "rxjs";
import { returnDefaultSearchParams, SearchParams } from "../model/search-params.interface";
import { filter, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { deepMerge } from '@delon/util';

@Injectable()
export abstract class CRUDService {


  public searchUrl: string = '';
  public addUrl: string = '';
  public deleteUrl: string = '';
  public updateUrl: string = '';
  public exportUrl: string = '';

  private _search$ = new BehaviorSubject<SearchParams>(null);
  public datasource$ = this._search$.asObservable()
                        .pipe(filter(params => params !== null))
                        .pipe(switchMap( (params) => {
                            return  this.http.get(this.searchUrl, params).pipe(
                              map(response => {
                                if(!response.meta.success) {
                                  this.message.error(response['meta']['message']);
                                }
                                return response;
                              })
                            );
                          })
                        );

  public params: SearchParams = {};

  constructor(
    private http: _HttpClient,
    private message: NzMessageService
  ) {}

  /**
   * 查询操作
   * 后端返回内容，原模原样返回
   * get 提交。
   * url:取自：searchUrl
   * 组件只需监听 `datasource$`属性，即可获取查询结果
   * @param param 查询参数。没有分页参数时，会自动添加分页参数。当不传参数时，则按照上次条件进行查询
   */
  public search(query?: SearchParams) {
    if(query) {
      this.params = deepMerge({}, query)
    }
    this._search$.next(this.params);
  }

  /**
   * 添加操作
   * 该接口自动显示添加成功或失败消息。
   * 后端返回内容，原模原样返回
   * post 提交。
   * url:取自：addUrl
   * @param param 更新后的
   */
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

  /**
   * 更新操作
   * 该接口自动显示更细成功或失败消息。
   * 后端返回内容，原模原样返回
   * post 提交。
   * url:取自：deleteUrl
   * @param param 更新后的
   */
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

  /**
   * 根据记录ID，删除操作
   * 该接口自动显示删除成功或失败消息。
   * 后端返回内容，原模原样返回
   * post 提交。
   * url:取自：deleteUrl
   * id 为路径参数
   * @param id 记录ID，
   */
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

  /**
   * 导出满足当前查询条件的所有数据。不分页。
   */
  public export(): Observable<any> {
    return this.http.post(this.exportUrl, this.params, null, {responseType: 'arraybuffer'});
  }


  /**
   * 通过后端接口，验证唯一性
   * @param checkUrl  后端接口
   * @param params 参数。比如电话号码。{mobile:13800000000,id:1}
   */
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
