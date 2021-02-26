import { SearchParams } from 'src/app/core/model/search-params.interface';
import { CRUDService } from 'src/app/core/service/crud.service';
import { environment } from 'src/environments/environment';

export abstract class PageAndSort{

  total: number = 0;
  currentPage: number = 1;
  pageSize = environment.pageSize;
  pageSizeOptions = environment.pageSizeOptions;

  constructor(private crudService: CRUDService) { }

  onPageChange() {

  }

  onSortChange() {

    const params: SearchParams = {... this.crudService.params};
    params.pageSize = this.pageSize;
    params.currentPage = this.currentPage;
    this.crudService.search(params);

  }

}
