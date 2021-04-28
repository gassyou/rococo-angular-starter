import { SearchParams } from 'src/app/freamwork/core/search-params.interface';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { environment } from 'src/environments/environment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Component, TemplateRef } from '@angular/core';

export abstract class BasicComponent{

  total: number = 0;
  currentPage: number = 1;
  pageSize = environment.pageSize;
  pageSizeOptions = environment.pageSizeOptions;
  tableDataSource = [];

  constructor(
    public crudService: CRUDService,
    public nzModal: NzModalService
    ) { }

  init() {
    this.crudService.datasource$.subscribe(
      result => {
        this.tableDataSource = result.data.records;
        this.total = result.data.total;
      }
    );
    this.crudService.search({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    });
  }

  onPageIndexChange() {
    const params: SearchParams = {... this.crudService.params};
    params.currentPage = this.currentPage;
    this.crudService.search(params);
  }

  onPageSizeChange() {
    const params: SearchParams = {... this.crudService.params};
    this.currentPage = 1;
    params.pageSize = this.pageSize;
    params.currentPage = this.currentPage;
    this.crudService.search(params);
  }

  onSortChange($event: { key: string; value: string} ) {
    const params: SearchParams = {... this.crudService.params};
    params.sortName = $event.key;
    params.sortValue = $event.value;
    this.crudService.search(params);
  }

  public openModal(
    title: string,
    defaultValue: any,
    cancelText: string,
    okText: string,
    content: any,
    contentParams: {},
    cancelFn?: () => void,
    okFn?: () => void) {

      const modal = this.nzModal.create({
        nzTitle: title,
        nzContent: content,
        nzComponentParams: contentParams,
        nzMaskClosable: false,
        nzFooter: [{
          label: cancelText,
          type: "default",
          onClick(): void{
            if(cancelFn) {
              cancelFn();
              modal.destroy();
            }
          }
        },{
          label: okText,
          type: "primary",
          loading: false,
          onClick(): void{
            this.loading = true;

          }
        }]
      });

  }

}
