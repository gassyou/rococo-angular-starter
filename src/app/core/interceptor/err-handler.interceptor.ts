import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MyApplicationService } from 'src/app/core/service/my-application.service';

import { I18NService } from '../service/i18n.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private message: NzMessageService,
    private router: Router,
    private modalSrv: NzModalService,
    private app: MyApplicationService,
    private notification: NzNotificationService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError((error: any, caught: Observable<HttpEvent<any>>) => {
        if (error['name'] === 'TimeoutError') {
          this.message.error(this.i18n.fanyi('common.msg.requestTimeout'));
          return throwError(() => new Error(error.error));
        }

        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 400:
              this.message.error(this.i18n.fanyi('common.msg.dataNotExisted'));
              return throwError(() => new Error(error.error));
            case 401:
              this.modalSrv.closeAll();
              this.message.remove();
              this.app.logout();
              this.message.error(this.i18n.fanyi('common.msg.authError'));
              return throwError(() => new Error(error.error));
            case 403:
              this.router.navigate(['/exception/403']);
              return throwError(error.error);
            case 404:
              this.router.navigate(['/exception/404']);
              return throwError(() => new Error(error.error));
            case 410:
              this.modalSrv.closeAll();
              this.message.remove();
              this.app.logout();
              this.message.error(this.i18n.fanyi('common.msg.loginError'));
              return throwError(() => new Error(error.error));
            case 500:
              return throwError(() => new Error(error.error));
            case 511:
              this.modalSrv.closeAll();
              this.message.remove();
              this.app.logout();
              this.message.error(error.error.meta?.message);
              return throwError(() => new Error(error.error));
          }
        }
        return error;
      })
    );
  }
}
