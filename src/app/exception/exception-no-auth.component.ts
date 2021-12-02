import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
  template: ` <exception type="403" style="min-height: 500px; height: 80%;">
    <button nz-button nzType="primary" (click)="goToLongin()">返回登录页</button>
  </exception>`,
  styles: []
})
export class ExceptionNoAuthComponent {
  constructor(private modalSrv: NzModalService, private router: Router) {
    this.modalSrv.closeAll();
  }
  goToLongin() {
    this.router.navigate(['/passport/login']);
  }
}
