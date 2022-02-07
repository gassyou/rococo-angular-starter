import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MyApplicationService } from 'src/app/core/service/my-application.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private message: NzMessageService,
    private router: Router,
    private modalSrv: NzModalService,
    private app: MyApplicationService,
    private notification: NzNotificationService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError((error: any, caught: Observable<HttpEvent<any>>) => {
        if (error['name'] === 'TimeoutError') {
          this.notification.warning('服务器超时', '服务器端的响应超时了！');
          return throwError(error.error);
        }

        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 400:
              this.message.error('相关数据不存在，可以尝试刷新后重试！');
              return throwError(error.error);
            case 401:
              this.modalSrv.closeAll();
              this.app.logout();
              this.message.error('授权信息发生变更或者已经失效，请再次登录系统');
              return throwError(error.error);
            case 403:
              this.router.navigate(['/exception/403']);
              return throwError(error.error);
            case 404:
              this.router.navigate(['/exception/404']);
              return throwError(error.error);
            case 410:
              this.modalSrv.closeAll();
              this.app.logout();
              this.message.error('登录异常，请重新登录！');
              return throwError(error.error);
            case 500:
              return throwError(error.error);
          }
        }
        return error;
      })
    );
  }
}
