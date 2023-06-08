import { AfterViewInit, Component, Inject, Input, OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, DelonFormModule } from '@delon/form';
import { ALAIN_I18N_TOKEN, AlainThemeModule } from '@delon/theme';
import { I18NService } from 'src/app/core/service/i18n.service';
import { SearchComponent } from 'src/app/freamwork/core/search-component';

import { CRUDService } from '../../freamwork/core/crud.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgIf } from '@angular/common';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DelonACLModule } from '@delon/acl';
import { NzCardModule } from 'ng-zorro-antd/card';
@Component({
    selector: 'app-advance-search-v2',
    template: `
    <nz-card id="searchForm" class="p-md" [style.display]="searchService.showAdvancePannel ? 'block' : 'none'">
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
      <div [acl]="searchAcl" [style.text-align]="inlineMode ? 'left' : 'center'" [style.width]="inlineMode ? '180px' : '100%'">
        <button nz-button (click)="reset()">{{ 'common.action.reset' | i18n }} </button>
        <button nz-button nzType="primary" (click)="advanceSearch(sf.value)">{{ 'common.action.search' | i18n }} </button>
        <button *ngIf="isShowExport" nz-button (click)="export(sf.value)">{{ 'common.action.export' | i18n }} </button>
        <a *ngIf="canExpand" nz-button nzType="link" (click)="onExpand(!isExpanded)">
          <span *ngIf="isExpanded">
            <i nz-icon nzType="up" nzTheme="outline" class="mr-sm"></i>
            {{ 'common.action.hidden' | i18n }}
          </span>
          <span *ngIf="!isExpanded">
            <i nz-icon nzType="down" nzTheme="outline" class="mr-sm"></i>
            {{ 'common.action.open' | i18n }}
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
    ],
    standalone: true,
    imports: [NzCardModule, DelonFormModule, DelonACLModule, NzButtonModule, NzWaveModule, NgIf, NzIconModule, AlainThemeModule]
})
export class AdvanceSearchV2Component extends SearchComponent implements AfterViewInit {
  @ViewChild('sf', { static: true }) sf!: SFComponent;

  @Input() placeholder: string = this.i18n.fanyi('common.action.search');

  @Input() searchAcl: any;

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

  constructor(@Optional() @SkipSelf() public searchService: CRUDService, @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService) {
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
