import { Component, OnDestroy, OnInit } from '@angular/core';
import { TokenService } from '@delon/auth';
import { Menu, MenuService } from '@delon/theme';
import { Subscription } from 'rxjs';
import { MyApplicationService } from 'src/app/core/service/my-application.service';

@Component({
  selector: 'app-home',
  template: `
    <div style="margin-top:80px">
      <nz-avatar [nzSize]="64" nzIcon="user" style="color:#f56a00; background-color:#fde3cf;"></nz-avatar>
      <span class="ml-md" style="font-size:24px; font-weight:bold; color:#767676"> {{ userName }} , 欢迎回来! </span>
    </div>

    <nz-divider></nz-divider>

    <div style="text-align:center;" nz-row [nzGutter]="[16, 8]">
      <div style="text-align:center;" nz-col [nzSm]="12" [nzMd]="8" [nzLg]="6" *ngFor="let item of menuList">
        <nz-card style="background:white">
          <a style="font-size:20px" [routerLink]="[item.link]">{{ item.text }}</a>
        </nz-card>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  userName: string = '';
  menuList: Menu[] = [];
  roleList: string[] = [];

  myInfoSubscription: Subscription | undefined;
  constructor(private app: MyApplicationService, private menu: MenuService, private token: TokenService) {}
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
      if (item.link && this.hasRoleToAccessMenu(item.acl as string[])) {
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
      if (menuAcl.includes(role)) {
        canAccess = true;
        break;
      }
    }

    return canAccess;
  }
}
