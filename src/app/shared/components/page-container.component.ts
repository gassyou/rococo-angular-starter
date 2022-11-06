import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SFSchema } from '@delon/form';
import { Menu, MenuService } from '@delon/theme';

@Component({
  selector: 'app-page',
  template: `
    <div class="alain-default__content-title" style="min-height: 54px">
      <nz-breadcrumb [nzAutoGenerate]="true">
        <ng-container *ngFor="let item of breadcrumbItems">
          <nz-breadcrumb-item>
            <a *ngIf="item.link; else noLink" [routerLink]="[item.link]">
              <i nz-icon [nzType]="item.icon ? item.icon.value : ''"></i>
              <span>{{ item.text }}</span>
            </a>
            <ng-template #noLink>
              <span>
                <i nz-icon [nzType]="item.icon ? item.icon.value : ''"></i>
                <span>{{ item.text }}</span>
              </span>
            </ng-template>
          </nz-breadcrumb-item>
        </ng-container>
      </nz-breadcrumb>
      <div>
        <app-advance-search
          class="mr-sm"
          *ngIf="simpleSearchKeys"
          [advanceSearchForm]="advanceSearchForm"
          [simpleSearchKeys]="simpleSearchKeys"
        >
        </app-advance-search>
        <ng-container *ngFor="let operation of operations">
          <button
            nz-button
            *ngIf="!operation.children; else moreAction"
            [nzType]="operation.type ? operation.type : 'primary'"
            (click)="operation?.onClick()"
          >
            <i *ngIf="operation.icon" nz-icon [nzType]="operation.icon"></i>
            {{ operation.text }}
          </button>

          <ng-template #moreAction>
            <button nz-button nz-dropdown [nzDropdownMenu]="menu">
              <i *ngIf="operation.icon" nz-icon [nzType]="operation.icon"></i>
              {{ operation.text }}
              <i *ngIf="operation.text" nz-icon nzType="down"></i>
            </button>
            <nz-dropdown-menu #menu="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item *ngFor="let item of operation.children">
                  <a (click)="item?.onClick()">
                    <i *ngIf="item.icon" nz-icon [nzType]="item.icon"></i>
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </nz-dropdown-menu>
          </ng-template>
        </ng-container>
      </div>
    </div>
    <div class="content">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .content {
        margin-left: -24px;
        margin-right: -24px;
        margin-top: -24px;
        margin-bottom: -24px;
        padding: 24px;
        height: calc(100vh - 105px);
        overflow-y: scroll;
      }
    `
  ]
})
export class PageContainerComponent {
  @Input() pageTitle: string | undefined;
  @Input() advanceSearchForm: SFSchema | undefined;
  @Input() simpleSearchKeys: string[] | null | undefined;

  @Input() operations: Operation[] = [];

  @Input()
  inlineMode = false;
  breadcrumbItems: Menu[] = [];
  constructor(private menuService: MenuService, private router: Router) {
    this.breadcrumbItems = this.menuService.getPathByUrl(this.router.url, true);
  }
}
export interface Operation {
  text: string;
  onClick?: Function;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  icon?: string;
  children?: Operation[];
}
