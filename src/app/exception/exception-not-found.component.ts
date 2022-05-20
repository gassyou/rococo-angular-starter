import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { MyApplicationService } from '../core/service/my-application.service';

@Component({
  template: `<exception type="404" style="min-height: 500px; height: 80%;" [backRouterLink]="myApp.homePageUrl"></exception>`,
  styles: []
})
export class ExceptionNotFoundComponent {
  constructor(modalSrv: NzModalService, public myApp: MyApplicationService) {
    modalSrv.closeAll();
  }
}
