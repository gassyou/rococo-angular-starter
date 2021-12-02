import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import ja from '@angular/common/locales/ja';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DelonACLModule } from '@delon/acl';
import { SimpleInterceptor, TokenService } from '@delon/auth';
import { DelonCacheModule } from '@delon/cache';
import { SettingsService, ALAIN_SETTING_KEYS, MenuService } from '@delon/theme';
import { ALAIN_CONFIG } from '@delon/util';
import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ja_JP, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/guard/auth-guard';
import { ErrorHandlerInterceptor } from './core/interceptor/err-handler.interceptor';
import { RefreshTokenHandlerInterceptor } from './core/interceptor/refresh-token-handler.interceptor';
import { TimeoutHandlerInterceptor } from './core/interceptor/timeout-handler.interceptor';
import { UrlHandlerInterceptor } from './core/interceptor/url-handler.interceptor';
import { StartupService } from './core/service/startup.service';
import { DecoratorService } from './freamwork/util/decorator.service';
import { GlobalConfigModule } from './global-config.module';
import { alainConfig } from './shared/delon.module';
import { ngZorroConfig } from './shared/zorro.module';

registerLocaleData(ja);

export function StartupServiceFactory(startupService: StartupService): () => Observable<void> {
  return () => startupService.load();
}
const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    DelonCacheModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    GlobalConfigModule.forRoot(),
    DelonACLModule.forRoot(),
    CoreModule,
    OverlayModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: ja_JP },
    { provide: ALAIN_CONFIG, useValue: alainConfig },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    { provide: HTTP_INTERCEPTORS, useClass: UrlHandlerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenHandlerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutHandlerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
    {
      provide: ALAIN_SETTING_KEYS,
      useValue: {
        layout: 'new-layout',
        user: 'new-user',
        app: 'new-app'
      }
    },
    AuthGuard,
    NzModalService,
    Overlay,
    NzDrawerService,
    NzMessageService,
    NzNotificationService,
    SettingsService,
    TokenService,
    DecoratorService,
    MenuService,
    ...APPINIT_PROVIDES,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
