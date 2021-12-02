import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  template: `<exception type="404" style="min-height: 500px; height: 80%;"></exception>`,
  styles: []
})
export class ExceptionNotFoundComponent {
  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }
}
