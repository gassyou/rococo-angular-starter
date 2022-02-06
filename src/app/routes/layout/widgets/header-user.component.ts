import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { MyInfo } from 'src/app/freamwork/core/application.service';
import { modalCreator } from 'src/app/freamwork/util/modal-creator';

import { EditMyPasswordComponent } from './edit-my-password.component';
import { MyInfoComponent } from './my-info.component';

@Component({
  selector: 'header-user',
  template: `
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
      <nz-avatar [nzText]="myInfo?.name[0]" nzSize="small" class="mr-sm"></nz-avatar>
      {{ myInfo?.name }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div nz-menu-item (click)="showMyInfo()">
          <i nz-icon nzType="user" class="mr-sm"></i>
          アカウント情報
        </div>
        <div nz-menu-item (click)="editPassword()">
          <i nz-icon nzType="setting" class="mr-sm"></i>
          パスワード変更
        </div>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          ログアウト
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent implements OnInit, OnDestroy {
  myInfoSubscription: Subscription | undefined;
  myInfo: MyInfo | undefined;
  constructor(private myApp: MyApplicationService, private nzModal: NzModalService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.myInfoSubscription = this.myApp.myInfo$.subscribe((response: any) => {
      this.myInfo = response.data;
      this.cdr.markForCheck();
    });
    this.myApp.getMyInfo();
  }

  ngOnDestroy(): void {
    this.myInfoSubscription?.unsubscribe();
  }

  editPassword() {
    modalCreator(this.nzModal, 'パスワードの変更', 'キャンセル', '変更', EditMyPasswordComponent, this.myInfo?.name);
  }

  showMyInfo() {
    modalCreator(this.nzModal, '個人情報', null, null, MyInfoComponent, this.myInfo, true);
  }

  logout(): void {
    this.myApp.logout();
  }
}
