import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UrlHandlerInterceptor } from './interceptor/url-handler.interceptor';

const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: UrlHandlerInterceptor, multi: true },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [...INTERCEPTOR_PROVIDES]
})
export class CoreModule { }
