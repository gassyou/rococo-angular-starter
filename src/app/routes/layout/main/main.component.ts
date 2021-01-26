import { Component, OnInit } from '@angular/core';
import { Menu } from '@delon/theme';
import { LayoutDefaultOptions } from '@delon/theme/layout-default';
import { MenuService } from '@delon/theme';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
})
export class MainComponent implements OnInit {

  options: LayoutDefaultOptions = {
    logoExpanded: '../../../assets/logo-full.png',
    logoCollapsed: '../../../assets/logo.png',
  }

  constructor(
    private menuService: MenuService,
  ) { }

  ngOnInit(): void {

    const menus: Menu[] = [
      {text:'测试一'},
      {text:'测试二'},
      {text:'测试三'}
    ];
    this.menuService.add(menus);
  }

}
