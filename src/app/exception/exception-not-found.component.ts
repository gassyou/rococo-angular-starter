import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { MyApplicationService } from '../core/service/my-application.service';
import { ExceptionModule } from '@delon/abc/exception';

@Component({
    template: `<exception type="404" style="min-height: 500px; height: 80%;" [backRouterLink]="myApp.homePageUrl"></exception>`,
    styles: [],
    standalone: true,
    imports: [ExceptionModule]
})
export class ExceptionNotFoundComponent {
  constructor(modalSrv: NzModalService, public myApp: MyApplicationService) {
    modalSrv.closeAll();
  }
}
