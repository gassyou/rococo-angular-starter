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
    this.isOpen = !this.isOpen

  }

  advanceSearch(value): void {

    this.isAdvanceMode = true;
    let params: SearchParams = Object.assign({},value);
    params.currentPage = 1;
    this.searchService.search(params);
    this.isOpen = false;

  }

  simpleSearch() {

    this.isAdvanceMode = false;
    let params: SearchParams = {};
    this.simpleSearchKeys.forEach(key =>{
      params[key] = this.simpleSearchValue;
    });
    params.currentPage = 1;
    this.searchService.search(params);

  }

  reset(): void {

    this.searchService.search({currentPage: 1});
    this.advanceSearchValue = Object.assign({}, this.searchService.params);
    this.simpleSearchValue = '';

    this.isOpen = false;
  }

}
