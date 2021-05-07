import { SearchParams } from 'src/app/freamwork/core/search-params.interface';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { environment } from 'src/environments/environment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormComponent } from './form-component';
import { Observable } from 'rxjs';

export abstract class ListComponent {

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
    cancelText: string,
    okText: string,
    content: FormComponent | any,
    contentParams?: {}) {

      const modal = this.nzModal.create({
        nzTitle: title,
        nzContent: content,
        nzComponentParams: contentParams,
        nzMaskClosable: false,
        nzFooter: [{
          label: cancelText,
          type: "default",
          onClick(): void {
            const instance : FormComponent | any = modal.getContentComponent();
            instance.cancel();
            modal.destroy();
          }
        },{
          label: okText,
          type: "primary",
          loading: false,
          onClick(): void {
            this.loading = true;
            const instance : FormComponent | any = modal.getContentComponent();
            const submit: Observable<any> = instance.submit();
            if(submit) {
              submit.subscribe(result => {
                this.loading = false;
                if(result) {
                  modal.destroy();
                }
              });
            } else {
              this.loading = false;
            }
          }
        }]
      });

  }

}
