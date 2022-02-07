import { Injectable, Optional } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { combineSearchParams, SearchParams } from './search-params.interface';

@Injectable()
export abstract class CRUDService {
  public searchUrl: string = '';
  public addUrl: string = '';
  public deleteUrl: string = '';
  public updateUrl: string = '';
  public exportUrl: string = '';
  public allDataUrl: string = '';

  public tableDataLoading = false;

  private _search$ = new BehaviorSubject<SearchParams | null>(null);
  public datasource$ = this._search$
    .asObservable()
    .pipe(filter((params: SearchParams | null) => params !== null))
    .pipe(
      switchMap((params: SearchParams | null) => {
        return this.http.post(this.searchUrl, params).pipe(
          map((response: any) => {
            this.tableDataLoading = false;
            if (!response.meta.success) {
              this.message.error(response['meta']['message']);
            }
            return response;
          })
        );
      })
    );

  private _params: SearchParams = {};
  public get params() {
    return this._params;
  }

  constructor(public http: _HttpClient, @Optional() public message: NzMessageService) {}

  /**
   * 获取全部数据，不分页。
   *
   * @returns
   */
  public all(): Observable<any> | null {
    if (!this.allDataUrl) {
      return null;
    }

    return this.http.post(this.allDataUrl).pipe(
      map((response: any) => {
        if (!response.meta.success) {
          this.message.error(response['meta']['message']);
        }
        return response.data;
      })
    );
  }

  /**
   * 查询操作
   * 后端返回内容，原模原样返回
   * get 提交。
   * url:取自：searchUrl
   * 组件只需监听 `datasource$`属性，即可获取查询结果
   *
   * @param param 查询参数。没有分页参数时，会自动添加分页参数。当不传参数时，则按照上次条件进行查询
   */
  public search(query?: SearchParams | any) {
    if (!this.searchUrl) {
      return;
    }

    if (query) {
      this._params = combineSearchParams(this._params, query);
    }
    this.tableDataLoading = true;
    this._search$.next(this._params);
  }

  /**
   * 添加操作
   * 该接口自动显示添加成功或失败消息。
   * 后端返回内容，原模原样返回
   * post 提交。
   * url:取自：addUrl
   *
   * @param param 更新后的
   */
  public add(param: any): Observable<any> | null {
    if (!this.addUrl) {
      return null;
    }
    return this.http.post(this.addUrl, param).pipe(
      map((response: any) => {
        if (response['meta']['success']) {
          this.message.info('添加成功');
          this.search();
          // 无返回则直接返回true，否则弹出框无法关闭
          return response.data ? response.data : true;
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
   *
   * @param param 更新后的
   */
  public update(param: any): Observable<any> | null {
    if (!this.updateUrl) {
      return null;
    }

    return this.http.post(this.updateUrl, param).pipe(
      map((response: any) => {
        if (response['meta']['success']) {
          this.message.info('修改成功');
          this.search();
          // 无返回则直接返回true，否则弹出框无法关闭
          return response.data ? response.data : true;
        } else {
          this.message.error(response['meta']['message']);
          return false;
        }
      })
    );
  }

  /**
   * 根据记录ID，删除操作
   * 该接口自动显示削除成功或失败消息。
   * 后端返回内容，原模原样返回
   * post 提交。
   * url:取自：deleteUrl
   * id 为路径参数
   *
   * @param id 记录ID，
   */
  public delete(id: number): Observable<any> | null {
    if (!this.deleteUrl) {
      return null;
    }

    return this.http.post(this.deleteUrl, { id }).pipe(
      map((response: any) => {
        if (response['meta']['success']) {
          this.message.info('削除成功');
          this.search();
          return response.data;
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
  public export(): Observable<any> | null {
    if (!this.exportUrl) {
      return null;
    }
    this.tableDataLoading = true;
    return this.http.post(this.exportUrl, this.params, null, { responseType: 'arraybuffer' }).pipe(
      map((response: any) => {
        try {
          const result = JSON.parse(new TextDecoder().decode(response));
          if (result.meta && result.meta.success === false) {
            this.message.error(result.meta.message);
            return false;
          }
        } catch (e) {}

        if (response.byteLength === 0) {
          this.message.error('文件不存在');
          return false;
        }
        this.tableDataLoading = false;
        return response;
      })
    );
  }

  /**
   * 通过后端接口，进行异步验证
   *
   * @param checkUrl  后端接口
   * @param params 参数。比如电话号码。{mobile:13800000000,id:1}
   */
  public asyncValidate(checkUrl: string, params: any): Observable<any> {
    return this.http.post(checkUrl, params).pipe(
      map((result: any) => {
        if (result['meta']['success']) {
          return null;
        } else {
          return { serverError: { msg: result['meta']['message'] } };
        }
      })
    );
  }

  // get类型校验
  public asyncValidateGet(checkUrl: string, params: any): Observable<any> {
    return this.http.get(checkUrl, params).pipe(
      map((result: any) => {
        if (result['meta']['success']) {
          return null;
        } else {
          return { serverError: { msg: result['meta']['message'] } };
        }
      })
    );
  }
}
