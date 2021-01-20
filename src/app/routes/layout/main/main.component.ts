import { Component, OnInit } from '@angular/core';
import { LayoutDefaultOptions } from '@delon/theme/layout-default';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  options: LayoutDefaultOptions = {
    logoExpanded: '../../../assets/logo-full.png',
    logoCollapsed: '../../../assets/logo.png',
  }

  constructor() { }

  ngOnInit(): void {
  }

}
