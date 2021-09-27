import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MyAppService } from '../service/my-app.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private message: NzMessageService, private router: Router, private modalSrv: NzModalService, private app: MyAppService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 400:
              this.message.error('相关数据不存在，可以尝试刷新后重试！');
              return throwError(error.error);
            case 401:
              this.modalSrv.closeAll();
              this.app.logout();
              this.router.navigate(['/passport/login']);
              if (error.error.code === 401000) {
                this.message.error('请先登录系统');
              }
              if (error.error.code === 401001) {
                this.message.error('授权信息发生变更或者已经失效，请再次登录系统');
              }
              return throwError(error.error);
            case 403:
              this.router.navigate(['/exception/403']);
              return throwError(error.error);
            case 404:
              this.router.navigate(['/exception/404']);
              return throwError(error.error);
            case 500:
              return throwError(error.error);
          }
        }
      })
    );
  }
}
