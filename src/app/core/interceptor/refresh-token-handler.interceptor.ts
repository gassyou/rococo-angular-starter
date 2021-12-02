import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '@delon/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RefreshTokenHandlerInterceptor implements HttpInterceptor {
  constructor(public tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((response: any) => {
        if (response instanceof HttpResponse && response.status === 200) {
          const header = response.headers.get('Refresh-Token');
          if (!header) {
            return response;
          }

          const newTokens = header.split(';');
          const tokenModel = this.tokenService.get();
          tokenModel.token = newTokens[0];
          tokenModel.time = new Date().getTime();
          this.tokenService.set(tokenModel);
        }
        return response;
      })
    );
  }
}
