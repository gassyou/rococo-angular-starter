import { Component, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { SFSchema } from '@delon/form';
import { SearchComponent } from 'src/app/freamwork/core/search-component';

import { CRUDService } from '../../freamwork/core/crud.service';
@Component({
  selector: 'app-advance-search-v2',
  template: `
    <nz-card style="padding: 8px">
      <sf
        [style.display]="inlineMode ? 'inline-block' : 'block'"
        [style.width]="inlineMode ? '300px' : '100%'"
        [mode]="inlineMode ? 'search' : 'default'"
        #sf
        [formData]="advanceSearchValue"
        [schema]="showForm"
        button="none"
        compact="true"
      >
      </sf>
      <div
        [style.text-align]="inlineMode ? 'left' : 'center'"
        [style.display]="inlineMode ? 'inline-block' : 'block'"
        [style.width]="inlineMode ? 'calc(100% - 300px)' : '100%'"
      >
        <button nz-button nzSize="small" (click)="reset()">重置 </button>
        <button nz-button nzType="primary" nzSize="small" (click)="advanceSearch(sf.value)">查询 </button>
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
    `
  ]
})
export class AdvanceSearchV2Component extends SearchComponent {
  @Input() placeholder: string = '查询';

  @Input('advanceSearchForm')
  set form(value: SFSchema | Component | null) {
    this.originalForm = value;

    if (this.originalForm && !(this.originalForm instanceof Component) && this.originalForm.properties) {
      let keys = Object.keys(this.originalForm.properties);
      this.canExpand = keys.length > 3;
    }

    this.showForm = { ...this.getShowForm() };
  }

  @Input('simpleSearchKeys')
  simpleSearchKeys: string[] = [];

  @Input()
  inlineMode = false;

  isOpen: boolean = false;
  simpleSearchValue = '';
  advanceSearchValue: any = {};

  isAdvanceMode: boolean = false;
  isExpanded: boolean = false;
  canExpand: boolean = false;

  originalForm: SFSchema | Component | null = null;
  showForm: SFSchema | Component | null = null;

  constructor(@Optional() @SkipSelf() public searchService: CRUDService) {
    super(searchService);
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
    // this.isOpen = false;
  }

  onExpand() {
    this.isExpanded = !this.isExpanded;
    this.showForm = { ...this.getShowForm() };
  }

  getShowForm() {
    if (this.isExpanded) {
      return this.originalForm;
    }

    if (!this.originalForm) {
      return this.originalForm;
    }

    if (this.originalForm instanceof Component) {
      return this.originalForm;
    }

    if (!this.originalForm.properties) {
      return this.originalForm;
    }

    let keys = Object.keys(this.originalForm.properties);

    if (keys.length <= 3) {
      return this.originalForm;
    }

    let newForm: SFSchema = {};
    newForm.ui = this.originalForm.ui;

    let properties = {};
    properties[keys[0]] = this.originalForm.properties[keys[0]];
    properties[keys[1]] = this.originalForm.properties[keys[1]];
    properties[keys[2]] = this.originalForm.properties[keys[2]];
    newForm.properties = properties;
    return newForm;
  }
}
