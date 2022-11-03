import { Component, Inject, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { SFSchema } from '@delon/form';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { I18NService } from 'src/app/core/service/i18n.service';
import { SearchComponent } from 'src/app/freamwork/core/search-component';

import { CRUDService } from '../../freamwork/core/crud.service';
@Component({
  selector: 'app-advance-search',
  template: `<nz-input-group
      nzSearch
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      [nzSuffix]="searchButton"
      [nzPrefix]="form ? moreButton : null"
    >
      <input
        type="text"
        class="search-input"
        nz-input
        [placeholder]="placeholder"
        [(ngModel)]="simpleSearchValue"
        (keyup.enter)="simpleSearch()"
      />
    </nz-input-group>

    <ng-template #searchButton>
      <button nz-button nzSearch class="search-btn" nzSize="small" (click)="simpleSearch()">
        <i nz-icon nzType="search"></i>
      </button>
    </ng-template>

    <ng-template #moreButton>
      <button class="search-btn" nz-button (click)="showAdvance()" nzSize="small">
        <i nz-icon nzType="caret-down" nzTheme="outline"></i>
      </button>
    </ng-template>

    <ng-template
      cdkConnectedOverlay
      cdkConnectedOverlayMinWidth="417px"
      cdkConnectedOverlayHasBackdrop="true"
      (backdropClick)="isOpen = false"
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen"
    >
      <nz-card class="sk">
        <sf #sf [formData]="advanceSearchValue" [schema]="form" button="none" compact="true"> </sf>
        <div class="modal-footer">
          <button nz-button nzSize="small" (click)="reset()">{{ 'common.action.reset' | i18n }} </button>

          <button nz-button nzType="primary" nzSize="small" (click)="advanceSearch(sf.value)">{{ 'common.action.search' | i18n }} </button>
        </div>
      </nz-card>
    </ng-template> `,
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
      .search-input {
        width: 350px;

        @media screen and (max-width: 1000px) {
          width: 200px;
        }

        @media screen and (max-width: 900px) {
          width: 100px;
        }
      }
    `
  ]
})
export class AdvanceSearchComponent extends SearchComponent {
  @Input() placeholder: string = this.i18n.fanyi('common.action.search');

  @Input('advanceSearchForm')
  form: SFSchema | Component | null = null;

  @Input('simpleSearchKeys')
  simpleSearchKeys: string[] = [];

  isOpen: boolean = false;
  simpleSearchValue = '';
  advanceSearchValue: any = {};

  isAdvanceMode: boolean = false;

  constructor(@Optional() @SkipSelf() public searchService: CRUDService, @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService) {
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
}
