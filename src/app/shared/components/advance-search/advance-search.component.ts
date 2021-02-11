import { Component, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { SFSchema } from '@delon/form';
import { SearchParams } from 'src/app/core/model/search-params.interface';
import { CRUDService } from '../../../core/service/crud.service';
@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.less'],
})
export class AdvanceSearchComponent implements OnInit {

  @Input() placeholder: string = '查询';

  @Input('advanceSearchForm')
  form: SFSchema | Component = null;

  @Input('simpleSearchKeys')
  simpleSearchKeys: string[] = [];

  isOpen: boolean = false;
  simpleSearchValue = '';
  advanceSearchValue: any = {}

  isAdvanceMode: boolean = false;

  constructor(
    @Optional() @SkipSelf() public searchService: CRUDService
  ) { }

  ngOnInit(): void {}

  showAdvance() {
    if(!this.isOpen && this.isAdvanceMode) {
      this.advanceSearchValue = this.searchService.params;
    }
    this.isOpen=!this.isOpen
  }

  advanceSearch(value): void {
    this.isAdvanceMode = true;

    let params: SearchParams = Object.assign({},value);

    params.currentPage = this.searchService.params.currentPage;
    params.pageSize = this.searchService.params.pageSize;
    params.sortName = this.searchService.params.sortName;
    params.sortValue = this.searchService.params.sortValue;

    this.searchService.search(params);
    this.isOpen = false;
  }

  simpleSearch() {

    this.isAdvanceMode = false;

    let params: SearchParams = {};
    this.simpleSearchKeys.forEach(key =>{
      params[key] = this.simpleSearchValue;
    });

    params.currentPage = this.searchService.params.currentPage;
    params.pageSize = this.searchService.params.pageSize;
    params.sortName = this.searchService.params.sortName;
    params.sortValue = this.searchService.params.sortValue;

    this.searchService.search(params);
  }

  reset(): void {
    let params: SearchParams = {};

    params.currentPage = this.searchService.params.currentPage;
    params.pageSize = this.searchService.params.pageSize;
    params.sortName = this.searchService.params.sortName;
    params.sortValue = this.searchService.params.sortValue;

    this.searchService.search(params);

    this.advanceSearchValue = Object.assign({}, params);
    this.simpleSearchValue = '';

    this.isOpen = false;
  }

}
