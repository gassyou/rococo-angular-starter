import { Component, Inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/core/service/core/auth.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { modalCreator } from 'src/app/freamwork/util/modal-creator';
import { AclById, ACLConfig } from 'src/app/freamwork/util/permission.decorator';

import { AuthViewModel } from '../view-model/auth-view-model';
import { AuthActionEditComponent } from './auth-action-edit.componet';
import { AuthBaseComponent } from './auth-base.component';

@Component({
  selector: 'app-module',
  template: `
    <label class="mr-md mb-md" nz-checkbox (contextmenu)="contextMenu($event, menu)" [(ngModel)]="this.viewModel.isChecked">
      {{ this.viewModel?.data.name | i18n }}
      <span style="color:#000;font-weight: lighter;"> (key: {{ this.viewModel.key }})</span>
    </label>
    <nz-dropdown-menu #menu="nzDropdownMenu">
      <ul nz-menu style="min-width:120px">
        <span [acl]="updeateActionAcl">
          <li nz-menu-item (click)="update()">
            <span nz-icon nzType="edit" nzTheme="outline" class="mr-sm"></span>
            {{ 'common.action.update' | i18n }}
          </li>
        </span>

        <span [acl]="deleteActionAcl">
          <li nz-menu-item nz-popconfirm nzPopconfirmTitle="{{ 'common.msg.delete-confirm' | i18n }}?" (nzOnConfirm)="deleteFunctoin()">
            <span nz-icon nzType="delete" nzTheme="outline" class="mr-sm"></span>
            {{ 'common.action.delete' | i18n }} ({{ this.viewModel?.data.name | i18n }})
          </li>
        </span>
      </ul>
    </nz-dropdown-menu>
  `,
  styles: [``]
})
export class AuthActionComponent implements OnInit, AuthBaseComponent {
  @Input()
  viewModel!: AuthViewModel;
  childViewRef!: ViewContainerRef;

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  constructor(
    private nzContextMenuService: NzContextMenuService,
    protected authService: AuthService,
    protected modal: NzModalService,
    public acl: ACLService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService
  ) {}

  @AclById(89)
  updeateActionAcl: any;

  @AclById(92)
  deleteActionAcl: any;

  @ACLConfig()
  ngOnInit(): void {}

  deleteFunctoin() {
    this.authService.deleteBatch([this.viewModel.data.id])?.subscribe();
  }

  update() {
    modalCreator(
      this.modal,
      this.i18n.fanyi('auth.updeateAction'),
      this.i18n.fanyi('common.action.cancel'),
      this.i18n.fanyi('common.action.ok'),
      AuthActionEditComponent,
      this.viewModel.data
    );
  }
}
