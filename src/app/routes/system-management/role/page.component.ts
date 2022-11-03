import { Component, Inject, OnInit } from '@angular/core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RoleService } from 'src/app/core/service/core/role.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { ListComponent } from 'src/app/freamwork/core/list-component';
import { AclById, ACLConfig } from 'src/app/freamwork/util/permission.decorator';

import { EditComponent } from './edit.component';

@Component({
  selector: 'app-role-page',
  template: `
    <app-page-v2
      [advanceSearchForm]="advanceSearchForm"
      [simpleSearchKeys]="simpleSearchKeys"
      [operations]="operation"
      [searchAcl]="searchAcl"
    >
      <nz-table
        #basicTable
        [nzData]="tableDataSource"
        nzShowQuickJumper="true"
        nzShowSizeChanger="true"
        [nzShowTotal]="totalTemplate"
        nzFrontPagination="false"
        [nzLoading]="roleService.tableDataLoading"
        [nzTotal]="total"
        [(nzPageSize)]="pageSize"
        [(nzPageIndex)]="currentPage"
        [nzPageSizeOptions]="pageSizeOptions"
        (nzPageIndexChange)="onPageIndexChange()"
        (nzPageSizeChange)="onPageSizeChange()"
      >
        <thead>
          <tr>
            <th>{{ 'common.lbl.no' | i18n }}</th>
            <th>{{ 'role.name' | i18n }}</th>
            <th>{{ 'role.remark' | i18n }}</th>
            <th>{{ 'common.lbl.enable' | i18n }}</th>
            <th>{{ 'common.lbl.operate' | i18n }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of basicTable.data; let idx = index">
            <td>{{ idx + (currentPage - 1) * pageSize + 1 }}</td>
            <td>{{ data.name }}</td>
            <td>{{ data.remark }}</td>
            <td>
              <span [acl]="startusingAcl">
                <nz-switch nzSize="small" [ngModel]="data.enable === 0" (ngModelChange)="clickEnableSwitch(data)"></nz-switch>
              </span>
            </td>
            <td>
              <span *aclIf="editAcl">
                <a (click)="edit(data)">{{ 'common.action.edit' | i18n }}</a>
                <nz-divider nzType="vertical"></nz-divider>
              </span>

              <span *aclIf="passwordChangeAcl">
                <a
                  nz-popconfirm
                  nzPopconfirmTitle="{{ 'common.msg.delete-confirm' | i18n }}?"
                  nzOkText="{{ 'common.action.ok' | i18n }}"
                  nzCancelText="{{ 'common.action.cancel' | i18n }}"
                  (nzOnConfirm)="deleteData(data)"
                  >{{ 'common.action.delete' | i18n }}</a
                >
                <nz-divider nzType="vertical"></nz-divider>
              </span>
            </td>
          </tr>
        </tbody>
      </nz-table>
      <ng-template #totalTemplate let-total>{{ 'common.lbl.totalRecord' | i18n: { total: total } }} </ng-template>
    </app-page-v2>
  `,
  styles: []
})
export class PageComponent extends ListComponent implements OnInit {
  simpleSearchKeys = ['name', 'remark', 'enable'];
  advanceSearchForm = {
    properties: {
      name: { type: 'string', title: this.i18n.fanyi('role.name') },
      remark: { type: 'string', title: this.i18n.fanyi('role.remark') },
      enable: {
        type: 'string',
        title: this.i18n.fanyi('common.lbl.enable'),
        enum: [
          { label: this.i18n.fanyi('role.enableTrue'), value: '0' },
          { label: this.i18n.fanyi('role.enableFalse'), value: '1' }
        ],
        ui: {
          widget: 'select',
          allowClear: true
        }
      }
    },
    ui: {
      spanLabelFixed: 100,
      grid: {
        span: 8
      }
    }
  };
  operation: any;

  constructor(
    public roleService: RoleService,
    public nzModal: NzModalService,
    public acl: ACLService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService
  ) {
    super(roleService, nzModal);
  }

  clickEnableSwitch(data: any) {
    var temp = data.enable;
    if (data.enable === 0) {
      data.enable = 1;
      data.deleteFlag = 1;
    } else {
      data.enable = 0;
      data.deleteFlag = 0;
    }
    var param = {
      id: data ? data.id : null,
      name: data ? data.name : null,
      remark: data ? data.remark : null,
      deleteFlag: data ? data.deleteFlag : null
    };

    this.roleService.update(param)?.subscribe(response => {
      if (!response) {
        data.enable = temp;
      }
    });
  }

  edit(data?: any) {
    super.openModal(
      data ? this.i18n.fanyi('common.action.edit') : this.i18n.fanyi('common.action.add'),
      this.i18n.fanyi('common.action.cancel'),
      this.i18n.fanyi('common.action.ok'),
      EditComponent,
      data
    );
  }

  deleteData(data?: any) {
    this.roleService.delete(data.id)?.subscribe();
  }

  @AclById(72)
  startusingAcl: any;

  @AclById(73)
  editAcl: any;

  @AclById(74)
  passwordChangeAcl: any;

  @AclById(75)
  addUserAcl: any;

  @AclById(76)
  searchAcl: any;
  @ACLConfig()
  ngOnInit(): void {
    super.init();
    this.operation = [
      {
        text: this.i18n.fanyi('common.action.add'),
        acl: this.addUserAcl,
        icon: 'plus',
        onClick: () => {
          this.edit();
        }
      }
    ];
  }
}
