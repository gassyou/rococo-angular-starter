import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, Menu, MenuService, AlainThemeModule } from '@delon/theme';
import { Subscription } from 'rxjs';
import { I18NService } from 'src/app/core/service/i18n.service';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { RouterLink } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NgFor } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
    selector: 'app-home',
    template: `
    <div style="margin-top:80px">
      <nz-avatar [nzSize]="64" nzIcon="user" style="color:#f56a00; background-color:#fde3cf;"></nz-avatar>
      <span class="ml-md" style="font-size:24px; font-weight:bold; color:#767676"> {{ userName }} , {{ 'home.welcome' | i18n }}! </span>
    </div>

    <nz-divider></nz-divider>

    <div style="text-align:center;" nz-row [nzGutter]="[16, 8]">
      <div style="text-align:center;" nz-col [nzSm]="12" [nzMd]="8" [nzLg]="6" *ngFor="let item of menuList">
        <nz-card nzHoverable="true" style="background:white" [routerLink]="[item.link]">
          <a style="font-size:20px">{{ item.text }}</a>
        </nz-card>
      </div>
    </div>
  `,
    styles: [],
    standalone: true,
    imports: [NzAvatarModule, NzDividerModule, NzGridModule, NgFor, NzCardModule, RouterLink, AlainThemeModule]
})
export class HomeComponent implements OnInit, OnDestroy {
  userName: string = '';
  menuList: Menu[] = [];
  roleList: string[] = [];

  myInfoSubscription: Subscription | undefined;
  constructor(
    private app: MyApplicationService,
    private menu: MenuService,
    private token: TokenService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService
  ) {}
  ngOnDestroy(): void {
    this.myInfoSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.myInfoSubscription = this.app.myInfo$.subscribe((data: any) => {
      this.userName = data.data.name;
    });

    this.roleList = this.token.get().roleList;
    this.setMenu(this.menu.menus);
  }

  private setMenu(menuList: Menu[]) {
    menuList.forEach(item => {
      if (item.link && item.link !== '' && this.hasRoleToAccessMenu(item.acl as string[]) && !item.group) {
        this.menuList.push(item);
      }

      if (item.children && item.children.length > 0) {
        this.setMenu(item.children);
      }
    });
  }

  private hasRoleToAccessMenu(menuAcl: string[]): boolean {
    let canAccess = false;

    for (let role of this.roleList) {
      if (menuAcl && menuAcl.includes(role)) {
        canAccess = true;
        break;
      }
    }

    return canAccess;
  }
}
