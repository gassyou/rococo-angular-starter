import { AfterViewInit, Component, Input, OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import { SearchComponent } from 'src/app/freamwork/core/search-component';

import { CRUDService } from '../../freamwork/core/crud.service';
@Component({
  selector: 'app-advance-search-v2',
  template: `
    <nz-card id="searchForm" class="p-md">
      <sf
        [style.width]="inlineMode ? (formItemCount <= 1 ? '500px' : '1000px') : '100%'"
        #sf
        [formData]="advanceSearchValue"
        [schema]="originalForm"
        button="none"
        compact="true"
        [class]="inlineMode ? 'mr-md' : ''"
      >
      </sf>
      <div [style.text-align]="inlineMode ? 'left' : 'center'" [style.width]="inlineMode ? '120px' : '100%'">
        <button nz-button style="height: 28px" nzSize="small" (click)="reset()">重置 </button>
        <button nz-button style="height: 28px" nzType="primary" nzSize="small" (click)="advanceSearch(sf.value)">查询 </button>
        <a *ngIf="canExpand" nz-button nzType="link" (click)="onExpand()">
          <span *ngIf="isExpanded">
            <i nz-icon nzType="up" nzTheme="outline" class="mr-sm"></i>
            收起
          </span>
          <span *ngIf="!isExpanded">
            <i nz-icon nzType="down" nzTheme="outline" class="mr-sm"></i>
            展开
          </span>
        </a>
      </div>
    </nz-card>
  `,
  styles: [
    `
      .search-btn {
        background: none;
        border: none;
      }

      .search-btn:hover {
        background-color: #e3e5e6;
      }

      .sk {
        -webkit-box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
        -webkit-box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
        box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
        border: 1px solid #ccc;
        border: 1px solid rgba(0, 0, 0, 0.2);
        width: 100%;
        padding-bottom: 6px;
      }

      ::ng-deep #searchForm .ant-card-body {
        display: flex;
        flex-wrap: wrap !important;
        padding: 8px;
        width: 100%;
      }

      ::ng-deep #searchForm .ant-picker {
        width: 100%;
      }
    `
  ]
})
@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.less']
})
export class AdvanceSearchV2Component extends SearchComponent implements AfterViewInit {
  @ViewChild('sf', { static: true }) sf!: SFComponent;

  @Input() placeholder: string = '查询';

  @Input('advanceSearchForm')
  set form(value: SFSchema | Component | null) {
    this.originalForm = value;
    if (this.originalForm && !(this.originalForm instanceof Component) && this.originalForm.properties) {
      let keys = Object.keys(this.originalForm.properties);
      this.canExpand = keys.length > 3;
    }
  }

  public get formItemCount() {
    if (this.originalForm && !(this.originalForm instanceof Component) && this.originalForm.properties) {
      let keys = Object.keys(this.originalForm.properties);
      return keys.length;
    }
    return 0;
  }

  @Input('simpleSearchKeys')
  simpleSearchKeys: string[] = [];

  @Input()
  inlineMode = false;

  @Input()
  isShowExport = false;

  isOpen: boolean = false;
  simpleSearchValue = '';
  advanceSearchValue: any = {};

  isAdvanceMode: boolean = false;
  isExpanded: boolean = false;
  canExpand: boolean = false;

  originalForm: SFSchema | Component | null = null;

  constructor(@Optional() @SkipSelf() public searchService: CRUDService) {
    super(searchService);
  }

  ngAfterViewInit(): void {
    this.onExpand(false);
  }

  showAdvance() {
    if (!this.isOpen && this.isAdvanceMode) {
      this.advanceSearchValue = this.searchService.params;
    }
    this.isOpen = !this.isOpen;
  }

  advanceSearch(value: any): void {
    super.advanceSearch(value);
    this.isOpen = false;
  }


  simpleSearch() {
    super.simpleSearch(this.simpleSearchKeys, this.simpleSearchValue);
  }

  reset(): void {
    super.reset();
    this.advanceSearchValue = { ...this.searchService.params };
    this.simpleSearchValue = '';
  }

  onExpand(value: boolean = false) {
    this.isExpanded = value;
    if (!this.originalForm) {
      return;
    }
    if (this.originalForm instanceof Component) {
      return;
    }

    if (!this.originalForm.properties) {
      return;
    }

    let keys = Object.keys(this.originalForm.properties);

    let itemCount = 0;
    for (let item of keys) {
      const itemProperty = this.sf.getProperty(`/${item}`);

      if (!this.isExpanded && itemCount > 2) {
        itemProperty?.setVisible(false)?.widget?.detectChanges();
      } else {
        itemProperty?.setVisible(true)?.widget?.detectChanges();
      }
      itemCount++;
    }
  }
}
