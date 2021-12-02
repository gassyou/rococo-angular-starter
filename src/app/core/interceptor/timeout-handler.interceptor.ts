import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class TimeoutHandlerInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    let time = environment.defaultTimeout;
    if (request.headers.has('Keep-Time')) {
      time = 1000 * 60 * 60 * 24;
    }

    if (request.headers.has('Long-Request')) {
      time = 300000;
    }

    return next.handle(request).pipe(timeout(time));
  }
}
