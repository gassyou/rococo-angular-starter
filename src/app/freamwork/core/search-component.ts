import { Optional, SkipSelf } from '@angular/core';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { SearchParams } from 'src/app/freamwork/core/search-params.interface';

export abstract class SearchComponent {
  isAdvanceMode: boolean = false;
  constructor(@Optional() @SkipSelf() private crudService: CRUDService) {}

  advanceSearch(params: SearchParams | any): void {
    this.isAdvanceMode = true;
    let conditions: SearchParams = { ...params };
    params.currentPage = 1;
    this.crudService.search(conditions);
  }

  simpleSearch(paramKeys: string[], paramValue: any) {
    this.isAdvanceMode = false;
    let params: SearchParams = {};
    paramKeys.forEach(key => {
      params[key] = paramValue;
    });
    params.currentPage = 1;
    this.crudService.search(params);
  }

  reset(): void {
    this.crudService.search({ currentPage: 1 });
  }
}
