import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
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
      catchError(error => {
        if (error['name'] === 'TimeoutError') {
          this.notification.warning('タイムアウト', 'サーバーからレスポンスがタイムアウトになりました！');
          return throwError(error.error);
        }

        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 400:
              this.message.error('処理できないリクエストです！');
              return throwError(error.error);
            case 401:
              this.modalSrv.closeAll();
              this.app.logout();
              this.message.error('ログインが異常しました。もう一度ログインしてください！');
              return throwError(error.error);
            case 403:
              this.message.error('aa');
              this.router.navigate(['/exception/403']);
              return throwError(error.error);
            case 404:
              this.router.navigate(['/exception/404']);
              return throwError(error.error);
            case 410:
              this.modalSrv.closeAll();
              this.app.logout();
              this.message.error('ログインが異常しました。もう一度ログインしてください！');
              return throwError(error.error);
            case 500:
              return throwError(error.error);
          }
        }
      })
    );
  }
}
