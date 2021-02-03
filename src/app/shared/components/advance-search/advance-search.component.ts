import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.less']
})
export class AdvanceSearchComponent implements OnInit {

  @Input() placeholder: string = '查询';

  constructor() { }

  ngOnInit(): void {
  }

}
