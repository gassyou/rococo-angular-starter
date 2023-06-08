import { Component, OnInit } from '@angular/core';
import { ACLService } from '@delon/acl';
import { TokenService } from '@delon/auth';
import { MenuService, AlainThemeModule } from '@delon/theme';
import { LayoutDefaultOptions, LayoutDefaultModule } from '@delon/theme/layout-default';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { RouterOutlet } from '@angular/router';
import { HeaderUserComponent } from '../widgets/header-user.component';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.less'],
    standalone: true,
    imports: [LayoutDefaultModule, HeaderUserComponent, RouterOutlet, AlainThemeModule]
})
export class MainComponent implements OnInit {
  options: LayoutDefaultOptions = {
    logoExpanded: '../../../assets/logo-full.png',
    logoCollapsed: '../../../assets/logo.png',
    logoLink: this.myApp.homePageUrl
  };

  constructor(public myApp: MyApplicationService, public menu: MenuService, public token: TokenService, public acl: ACLService) {}

  ngOnInit(): void {
    // 权限数组（roleList）是字符串类型，那么可以使用this.acl.setRole()
    // 数字类型的roleList，需要使用setAbility() 方法
    // this.acl.setRole(this.token.get().roleList);

    if (this.myApp.demoLoginResponeseInfo) {
      this.acl.setFull(true);
    } else {
      this.acl.setAbility(this.token.get().roleList);
    }

    this.menu.add(this.menu.menus);
  }
}
