import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class UrlHandlerInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let url = request.url;

    if (!url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('assets/i18n/')) {
      url = environment.SERVER_URL + url;
    }

    const newRequest = request.clone({ url });
    return next.handle(newRequest);
  }
}
