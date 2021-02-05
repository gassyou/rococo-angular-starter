import { Component, Input, OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import { CRUD } from '../../common/curd';
import { SearchParams } from '../../common/search-params.interface';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.less']
})
export class AdvanceSearchComponent implements OnInit {

  @Input() placeholder: string = '查询';

  @Input('searchForm')
  form: SFSchema | Component = null;

  @ViewChild('sf',{static: true})
  sf: SFComponent;

  @Input('simpleSearch')
  simpleSearchParam: any;

  isOpen: boolean = false;

  constructor(
    @Optional() @SkipSelf() private searchService: CRUD
  ) { }

  ngOnInit(): void {
    this.search()
  }

  search(): void {

    let param: SearchParams = this.searchService.params;
    param = Object.assign(param, this.sf.value);
    this.searchService.search(param);
    this.isOpen = false;
  }

  reset(): void {
    this.sf.reset();
    this.search();
  }

  simpleSearch() {
    let param: SearchParams = this.searchService.params;
    param = Object.assign(param, this.simpleSearchParam);
    this.searchService.search(param);
  }

}
