import { Component, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { SFSchema } from '@delon/form';
import { SearchComponent } from 'src/app/freamwork/core/search-component';
import { CRUDService } from '../../../freamwork/core/crud.service';
@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.less'],
})
export class AdvanceSearchComponent extends SearchComponent implements OnInit {

  @Input() placeholder: string = '查询';

  @Input('advanceSearchForm')
  form: SFSchema | Component = null;

  @Input('simpleSearchKeys')
  simpleSearchKeys: string[] = [];

  isOpen: boolean = false;
  simpleSearchValue = '';
  advanceSearchValue: any = {};

  isAdvanceMode: boolean = false;

  constructor(
    @Optional() @SkipSelf() public searchService: CRUDService
  ) {
    super(searchService);
  }

  ngOnInit(): void {}

  showAdvance() {

    if(!this.isOpen && this.isAdvanceMode) {
      this.advanceSearchValue = this.searchService.params;
    }
    this.isOpen = !this.isOpen

  }

  advanceSearch(value): void {
    super.advanceSearch(value);
    this.isOpen = false;

  }

  simpleSearch() {
    super.simpleSearch(this.simpleSearchKeys,this.simpleSearchValue);
  }

  reset(): void {
    super.reset();
    this.advanceSearchValue = Object.assign({}, this.searchService.params);
    this.simpleSearchValue = '';
    this.isOpen = false;
  }

}
