import { Component, OnDestroy } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { SearchParams } from 'src/app/freamwork/core/search-params.interface';
import { environment } from 'src/environments/environment';

import { download } from '../util/file-util';
import { modalCreator } from '../util/modal-creator';
import { FormComponent } from './form-component';

@Component({ template: `` })
export abstract class ListComponent implements OnDestroy {
  total: number = 0;
  currentPage: number = 1;
  pageSize = environment.pageSize;
  pageSizeOptions = environment.pageSizeOptions;
  tableDataSource = [];

  dataSourceSubscription: Subscription | undefined;

  constructor(public crudService: CRUDService, public nzModal: NzModalService) {}

  ngOnDestroy(): void {
    if (this.dataSourceSubscription) {
      this.dataSourceSubscription.unsubscribe();
    }
  }

  init(param?: any, doSearch = true) {
    this.dataSourceSubscription = this.crudService.datasource$.subscribe((result: any) => {
      this.tableDataSource = result.data.records ? result.data.records : result.data;

      this.total = result.data.total;
      this.currentPage = this.crudService.params.currentPage ? this.crudService.params.currentPage : 1;
    });

    if (doSearch) {
      let params: any = {};
      if (param) {
        params = {
          current: this.currentPage,
          pageSize: this.pageSize,
          ...param
        };
      } else {
        params = {
          current: this.currentPage,
          pageSize: this.pageSize
        };
      }
      this.crudService.search(params);
    }
  }

  onPageIndexChange() {
    const params: SearchParams = { ...this.crudService.params };
    params.currentPage = this.currentPage;
    this.crudService.search(params);
  }

  onPageSizeChange() {
    const params: SearchParams = { ...this.crudService.params };
    this.currentPage = 1;
    params.pageSize = this.pageSize;
    params.currentPage = this.currentPage;
    this.crudService.search(params);
  }

  onSortChange($event: any) {
    const currentSort = $event.sort.find((item: any) => item.value !== null);
    const params: SearchParams = { ...this.crudService.params };
    params.sortName = currentSort?.key;
    params.sortValue = currentSort?.value;
    this.crudService.search(params);
  }

  export(saveFilename: string) {
    this.crudService.export()?.subscribe((data: any) => {
      !download(data, saveFilename);
    });
  }

  public openModal(
    title: string,
    cancelText: string,
    okText: string,
    content: FormComponent | any,
    contentParams?: any,
    width?: string,
    top?: string,
    okCallbak?: Function
  ) {
    modalCreator(this.nzModal, title, cancelText, okText, content, contentParams, width, top, okCallbak);
  }
}
