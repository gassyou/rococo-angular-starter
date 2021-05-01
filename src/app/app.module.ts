import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { ALAIN_CONFIG } from '@delon/util';
import { alainConfig } from './shared/delon.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { ngZorroConfig } from './shared/zorro.module';
import { ALAIN_SETTING_KEYS, SettingsService } from '@delon/theme';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModule,
    OverlayModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: ALAIN_CONFIG, useValue: alainConfig },
    { provide: NZ_CONFIG, useValue: ngZorroConfig } ,
    {
         provide: ALAIN_SETTING_KEYS,
         useValue: {
           layout: 'new-layout',
           user: 'new-user',
           app: 'new-app',
         },
       },
     NzModalService, Overlay, NzDrawerService, NzMessageService, SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
