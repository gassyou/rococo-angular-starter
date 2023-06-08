import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

import { MyApplicationService } from '../core/service/my-application.service';
import { AlainThemeModule } from '@delon/theme';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ExceptionModule } from '@delon/abc/exception';

@Component({
    template: ` <exception type="403" style="min-height: 500px; height: 80%;">
    <button nz-button nzType="primary" (click)="goToLongin()">{{ 'login.backLogin' | i18n }}</button>
  </exception>`,
    styles: [],
    standalone: true,
    imports: [ExceptionModule, NzButtonModule, NzWaveModule, AlainThemeModule]
})
export class ExceptionNoAuthComponent {
  constructor(private modalSrv: NzModalService, private router: Router, private myApp: MyApplicationService) {
    this.modalSrv.closeAll();
  }
  goToLongin() {
    this.router.navigate([this.myApp.loginPageUrl]);
  }
}
