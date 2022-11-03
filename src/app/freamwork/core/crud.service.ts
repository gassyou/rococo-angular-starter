import { Injectable, Optional } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { I18NService } from '../../core/service/i18n.service';
import { download } from '../util/file-util';
import { combineSearchParams, SearchParams } from './search-params.interface';

@Injectable()
export abstract class CRUDService {
  public searchUrl: string = '';
  public addUrl: string = '';
  public deleteUrl: string = '';
  public updateUrl: string = '';
  public exportUrl: string = '';
  public allDataUrl: string = '';
  public demoDataSource: any[] = [];
  public isEnergy: number = 0;

  public beforeSearch: (<T, P>(formValue: T | any) => P | any) | undefined;
  public afterSearch: (<T, P>(response: T | any) => P | any) | undefined;
  public beforeFormCommit: (<T, P>(formValue: T | any) => P | any) | undefined;
  public afterFormCommit: (<T, P>(response: T | any) => P | any) | undefined;
  public beforeExport: (<T, P>(formValue: T | any) => P | any) | undefined;
  public checkParamInfo: (<T, P>(searchParams: T | any) => P | any) | undefined;

  public tableDataLoading = false;

  private _search$ = new BehaviorSubject<SearchParams | null>(null);
  public datasource$ = this._search$
    .asObservable()
    .pipe(filter((params: SearchParams | null) => params !== null))
    .pipe(
      switchMap((params: SearchParams | null) => {
        if (this.demoDataSource && this.demoDataSource.length > 0) {
          this.tableDataLoading = false;
          return of({
            data: {
              total: this.demoDataSource.length,
              records: [...this.demoDataSource]
            }
          });
        }
        return this.http.post(this.searchUrl, params).pipe(
          map((response: any) => {
            this.tableDataLoading = false;
            if (!response.meta.success) {
              this.message.error(response['meta']['message']);
            }
            if (this.afterSearch) {
              response = this.afterSearch(response);
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

  constructor(public http: _HttpClient, @Optional() public message: NzMessageService, public i18n: I18NService) {}

  /**
   * 获取全部数据，不分页。
   *
   * @returns
   */
  public all(): Observable<any> | null {
    if (this.demoDataSource && this.demoDataSource.length > 0) {
      return of(this.demoDataSource);
    }
    if (!this.allDataUrl) {
      return of(null);
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
  public search(query?: SearchParams | any, before = true) {
    if (!this.searchUrl) {
      return;
    }
    if (query) {
      this._params = combineSearchParams(this._params, query);
      if (before && this.beforeSearch) {
        this._params = this.beforeSearch(this._params);
      }
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
    if (this.demoDataSource && this.demoDataSource.length > 0) {
      this.message.success(this.i18n.fanyi('common.msg.handle-ok'));
      param.id = this.demoDataSource.length + 1;
      this.demoDataSource.push(param);
      this.search();
      return of(true);
    }
    if (!this.addUrl) {
      return null;
    }

    if (this.beforeFormCommit) {
      param = this.beforeFormCommit(param);
    }
    return this.http.post(this.addUrl, param).pipe(
      map((response: any) => {
        if (response['meta']['success']) {
          this.message.success(this.i18n.fanyi('common.msg.handle-ok'));
          this.search();
          // 无返回则直接返回true，否则弹出框无法关闭
          if (this.afterFormCommit && response.data) {
            return this.afterFormCommit(response.data);
          }
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
    if (this.demoDataSource && this.demoDataSource.length > 0) {
      this.message.success(this.i18n.fanyi('common.msg.handle-ok'));
      this.demoDataSource = this.demoDataSource.map((item: any) => {
        if (item.id === param.id) {
          item = { ...param };
        }
        return item;
      });
      this.search();
      return of(true);
    }
    if (!this.updateUrl) {
      return null;
    }

    if (this.beforeFormCommit) {
      param = this.beforeFormCommit(param);
    }
    return this.http.post(this.updateUrl, param).pipe(
      map((response: any) => {
        if (response['meta']['success']) {
          this.message.success(this.i18n.fanyi('common.msg.handle-ok'));
          this.search();
          // 无返回则直接返回true，否则弹出框无法关闭
          if (this.afterFormCommit && response.data) {
            return this.afterFormCommit(response.data);
          }
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
    if (this.demoDataSource && this.demoDataSource.length > 0) {
      this.message.success(this.i18n.fanyi('common.msg.handle-ok'));
      this.demoDataSource = this.demoDataSource.filter((item: any) => {
        return item.id !== id;
      });
      this.search();
      return of(true);
    }
    if (!this.deleteUrl) {
      return null;
    }

    if (!id) {
      return null;
    }

    return this.http.post(`${this.deleteUrl}/${id}`).pipe(
      map((response: any) => {
        if (response['meta']['success']) {
          this.message.success(this.i18n.fanyi('common.msg.handle-ok'));
          this.search();
          return response.data;
        } else {
          this.message.error(response['meta']['message']);
          return false;
        }
      })
    );
  }

  public deleteBatch(idList: number[]): Observable<any> | null {
    if (this.demoDataSource && this.demoDataSource.length > 0) {
      this.message.success(this.i18n.fanyi('common.msg.handle-ok'));

      idList.forEach(item => {
        this.demoDataSource = this.demoDataSource.filter((item: any) => {
          return item.id !== item;
        });
      });

      this.search();
      return of(true);
    }
    if (!this.deleteUrl) {
      return null;
    }

    if (!idList || idList.length === 0) {
      return null;
    }

    return this.http.post(this.deleteUrl, [...idList]).pipe(
      map((response: any) => {
        if (response['meta']['success']) {
          this.message.success(this.i18n.fanyi('common.msg.handle-ok'));
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
          this.message.error(this.i18n.fanyi('common.file-not-exist'));
          return false;
        }
        this.tableDataLoading = false;
        return response;
      })
    );
  }

  public exportToExcel(param: SearchParams | any): Observable<any> | null {
    if (this.beforeExport) {
      param = this.beforeExport(param);
    }
    let filename = '';
    if (this.checkParamInfo) {
      filename = this.checkParamInfo(param);
    }
    if (!filename) {
      return null;
    }
    this.tableDataLoading = true;
    this.http.post(this.exportUrl, param, null, { responseType: 'arraybuffer' }).subscribe(
      json => {
        this.tableDataLoading = false;
        return download(json, `${filename}.xlsx`);
      },
      error => {
        console.log(error);
      }
    );
    return null;
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
