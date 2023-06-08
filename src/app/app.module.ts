import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import ja from '@angular/common/locales/ja';
import cn from '@angular/common/locales/zh';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DelonACLModule } from '@delon/acl';
import { SimpleInterceptor, TokenService } from '@delon/auth';
import { DelonCacheModule } from '@delon/cache';
import { SettingsService, ALAIN_SETTING_KEYS, MenuService, DELON_LOCALE, ALAIN_I18N_TOKEN } from '@delon/theme';
import { ALAIN_CONFIG } from '@delon/util';
import { zhCN as dateLang } from 'date-fns/locale';
import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ja_JP, NZ_DATE_LOCALE, NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/guard/auth-guard';
import { ErrorHandlerInterceptor } from './core/interceptor/err-handler.interceptor';
import { LangHandlerInterceptor } from './core/interceptor/lang-handler.interceptor';
import { RefreshTokenHandlerInterceptor } from './core/interceptor/refresh-token-handler.interceptor';
import { TimeoutHandlerInterceptor } from './core/interceptor/timeout-handler.interceptor';
import { UrlHandlerInterceptor } from './core/interceptor/url-handler.interceptor';
import { I18NService } from './core/service/i18n.service';
import { StartupService } from './core/service/startup.service';
import { DecoratorService } from './freamwork/util/decorator.service';
import { GlobalConfigModule } from './global-config.module';
import { alainConfig } from './shared/delon.module';
import { ngZorroConfig } from './shared/zorro.module';

registerLocaleData(cn);

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


