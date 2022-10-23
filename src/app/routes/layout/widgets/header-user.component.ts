import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { ALAIN_I18N_TOKEN, SettingsService } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { I18NService } from 'src/app/core/service/i18n.service';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { MyInfo } from 'src/app/freamwork/core/application.service';
import { modalCreator } from 'src/app/freamwork/util/modal-creator';

import { EditMyPasswordComponent } from './edit-my-password.component';
import { MyInfoComponent } from './my-info.component';

@Component({
  selector: 'header-user',
  template: `
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
      <nz-avatar style="background-color:#0069f7;" [nzText]="myInfo?.name[0]" nzSize="small" class="mr-sm"></nz-avatar>
      {{ myInfo?.name }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div nz-menu-item (click)="showMyInfo()">
          <i nz-icon nzType="user" class="mr-sm"></i>
          {{ 'app.myInfo' | i18n }}
        </div>
        <div nz-menu-item (click)="editPassword()">
          <i nz-icon nzType="setting" class="mr-sm"></i>
          {{ 'app.editMyPw' | i18n }}
        </div>
        <div nz-menu-item nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="left">
          <i nz-icon nzType="global" class="mr-sm"></i>
          {{ 'menu.lang' | i18n }}
        </div>
        <nz-dropdown-menu #langMenu="nzDropdownMenu">
          <ul nz-menu>
            <li nz-menu-item *ngFor="let item of langs" [nzSelected]="item.code === curLangCode" (click)="changeLang(item.code)">
              <span role="img" [attr.aria-label]="item.text" class="pr-xs">{{ item.abbr }}</span>
              {{ item.text }}
            </li>
          </ul>
        </nz-dropdown-menu>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          {{ 'app.logOut' | i18n }}
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

  get langs(): Array<{ code: string; text: string; abbr: string }> {
    return this.i18n.getLangs();
  }

  get curLangCode(): string {
    return this.settings.layout.lang;
  }

  constructor(
    private settings: SettingsService,
    private myApp: MyApplicationService,
    private nzModal: NzModalService,
    private cdr: ChangeDetectorRef,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService,
    @Inject(DOCUMENT) private doc: any
  ) {}

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
    modalCreator(
      this.nzModal,
      this.i18n.fanyi('app.editMyPw'),
      this.i18n.fanyi('common.cancel'),
      this.i18n.fanyi('app.editMyPw'),
      EditMyPasswordComponent,
      this.myInfo?.name
    );
  }

  showMyInfo() {
    modalCreator(this.nzModal, this.i18n.fanyi('app.myInfo'), null, null, MyInfoComponent, this.myInfo);
  }

  changeLang(lang: string): void {
    const spinEl = this.doc.createElement('div');
    spinEl.setAttribute('class', `page-loading ant-spin ant-spin-lg ant-spin-spinning`);
    spinEl.setAttribute('style', `background: #49a9ee;`);
    spinEl.innerHTML = `<span class="ant-spin-dot ant-spin-dot-spin"><i></i><i></i><i></i><i></i></span>`;
    this.doc.body.appendChild(spinEl);

    this.i18n.loadLangData(lang).subscribe(res => {
      this.i18n.use(lang, res);
      this.settings.setLayout('lang', lang);
      setTimeout(() => this.doc.location.reload());
    });
  }

  logout(): void {
    this.myApp.logout();
  }
}
