import { Component, OnDestroy } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subscription } from 'rxjs';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { SearchParams } from 'src/app/freamwork/core/search-params.interface';
import { environment } from 'src/environments/environment';

import { download } from '../util/file-util';
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

  init() {
    this.dataSourceSubscription = this.crudService.datasource$.subscribe((result: any) => {
      this.tableDataSource = result.data.records;
      this.total = result.data.total;
    });
    this.crudService.search({
      currentPage: this.currentPage,
      pageSize: this.pageSize
    });
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

  onSortChange($event: { key: string; value: string }) {
    const params: SearchParams = { ...this.crudService.params };
    params.sortName = $event.key;
    params.sortValue = $event.value;
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
    callbak?: Function
  ) {
    const modal = this.nzModal.create({
      nzTitle: title,
      nzContent: content,
      nzComponentParams: {
        value: contentParams
      },
      nzMaskClosable: false,
      nzFooter: [
        {
          label: cancelText,
          type: 'default',
          onClick(): void {
            const instance: FormComponent | any = modal.getContentComponent();
            instance.cancel();
            modal.destroy();
          }
        },
        {
          label: okText,
          type: 'primary',
          loading: false,
          onClick(): void {
            this.loading = true;
            const instance: FormComponent | any = modal.getContentComponent();
            const submit: Observable<any> = instance.submit();
            if (submit) {
              submit.subscribe((result: any) => {
                this.loading = false;
                if (callbak) {
                  callbak();
                }
                if (result) {
                  modal.destroy();
                }
              });
            } else {
              this.loading = false;
            }
          }
        }
      ]
    });
  }
}
