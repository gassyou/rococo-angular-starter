import { Component, OnInit } from '@angular/core';
import { ACLService } from '@delon/acl';
import { TokenService } from '@delon/auth';
import { MenuService } from '@delon/theme';
import { LayoutDefaultOptions } from '@delon/theme/layout-default';
import { MyApplicationService } from 'src/app/core/service/my-application.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  options: LayoutDefaultOptions = {
    logoExpanded: '../../../assets/logo-full.png',
    logoCollapsed: '../../../assets/logo.png',
    logoLink: this.myApp.homePageUrl
  };

  constructor(public myApp: MyApplicationService, public menu: MenuService, public token: TokenService, public acl: ACLService) {}

  ngOnInit(): void {
    this.acl.setRole(this.token.get().roleList);
    this.menu.add(this.menu.menus);
  }
}
