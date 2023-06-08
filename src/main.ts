import { enableProdMode, ViewEncapsulation, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { StartupServiceFactory } from './app/app.module';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { CoreModule } from './app/core/core.module';
import { DelonACLModule } from '@delon/acl';
import { GlobalConfigModule } from './app/global-config.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { DelonCacheModule } from '@delon/cache';
import { Observable } from 'rxjs';
import { StartupService } from './app/core/service/startup.service';
import { DecoratorService } from './app/freamwork/util/decorator.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthGuard } from './app/core/guard/auth-guard';
import { I18NService } from './app/core/service/i18n.service';
import { ErrorHandlerInterceptor } from './app/core/interceptor/err-handler.interceptor';
import { LangHandlerInterceptor } from './app/core/interceptor/lang-handler.interceptor';
import { TimeoutHandlerInterceptor } from './app/core/interceptor/timeout-handler.interceptor';
import { SimpleInterceptor, TokenService } from '@delon/auth';
import { RefreshTokenHandlerInterceptor } from './app/core/interceptor/refresh-token-handler.interceptor';
import { UrlHandlerInterceptor } from './app/core/interceptor/url-handler.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { ngZorroConfig } from './app/shared/zorro.module';
import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { alainConfig } from './app/shared/delon.module';
import { ALAIN_CONFIG } from '@delon/util';
import { zhCN as dateLang } from 'date-fns/locale';
import { DELON_LOCALE, ALAIN_I18N_TOKEN, ALAIN_SETTING_KEYS, SettingsService, MenuService } from '@delon/theme';
import { NZ_I18N, zh_CN, NZ_DATE_LOCALE } from 'ng-zorro-antd/i18n';

const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  }
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(DelonCacheModule, BrowserModule, AppRoutingModule, FormsModule, GlobalConfigModule.forRoot(), DelonACLModule.forRoot(), CoreModule, OverlayModule),
        { provide: NZ_I18N, useValue: zh_CN },
        { provide: DELON_LOCALE, useValue: zh_CN },
        { provide: NZ_DATE_LOCALE, useValue: dateLang },
        { provide: ALAIN_CONFIG, useValue: alainConfig },
        { provide: NZ_CONFIG, useValue: ngZorroConfig },
        { provide: HTTP_INTERCEPTORS, useClass: UrlHandlerInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenHandlerInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TimeoutHandlerInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LangHandlerInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
        { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
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
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .then(res => {
    const win = window as NzSafeAny;
    if (win && win.appBootstrap) {
      win.appBootstrap();
    }
    return res;
  })
  .catch(err => console.error(err));
