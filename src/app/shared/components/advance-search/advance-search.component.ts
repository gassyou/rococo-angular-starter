import { Component, Input, OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import { CRUDService } from '../../../core/service/crud.service';
@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.less'],
})
export class AdvanceSearchComponent implements OnInit {

  @Input() placeholder: string = '查询';

  @Input('searchForm')
  form: SFSchema | Component = null;

  @Input('simpleSearch')
  simpleSearchParam: any;

  isOpen: boolean = false;
  simpleSearchValue = '';
  advanceSearchValue: any = null;

  constructor(
    @Optional() @SkipSelf() private searchService: CRUDService
  ) { }

  ngOnInit(): void {
  }

  formValueChange(value: any): void {
    this.advanceSearchValue = {... value.value}
  }

  search(): void {
    this.searchService.search(this.advanceSearchValue);
    this.isOpen = false;
  }

  simpleSearch() {

    if(!this.simpleSearchParam) {
      return ;
    }

    for(const key in this.simpleSearchParam) {
      this.simpleSearchParam[key] = this.simpleSearchValue;
    }
    this.searchService.search(this.simpleSearchParam);
  }

}
