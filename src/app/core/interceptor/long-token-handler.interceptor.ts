import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '@delon/auth';
import { Observable } from 'rxjs';

@Injectable()
export class LongTokenHandlerInterceptor implements HttpInterceptor {
  constructor(public tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let longToken = '';
    if (this.tokenService.get() && this.tokenService.get().longToken) {
      longToken = this.tokenService.get().longToken;
    }

    const newRequest = request.clone({
      setHeaders: { 'L-Authorization': longToken }
    });

    return next.handle(newRequest);
  }
}
