import { Component, Inject, OnInit } from '@angular/core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map } from 'rxjs/operators';
import { RoleService } from 'src/app/core/service/core/role.service';
import { UserService } from 'src/app/core/service/core/user.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { ListComponent } from 'src/app/freamwork/core/list-component';
import { AclById, ACLConfig } from 'src/app/freamwork/util/permission.decorator';

import { EditComponent } from './edit.component';
import { PasswordEditComponent } from './password-edit.component';

@Component({
  selector: 'user-list',
  template: ` <app-page-v2
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
      [nzLoading]="userService.tableDataLoading"
      [nzTotal]="total"
      [(nzPageSize)]="pageSize"
      [(nzPageIndex)]="currentPage"
      s
      [nzPageSizeOptions]="pageSizeOptions"
      (nzPageIndexChange)="onPageIndexChange()"
      (nzPageSizeChange)="onPageSizeChange()"
    >
      <thead>
        <tr>
          <th>{{ 'user.no' | i18n }}</th>
          <th>{{ 'user.name' | i18n }}</th>
          <th>{{ 'user.account' | i18n }}</th>
          <th>{{ 'user.role' | i18n }}</th>
          <th>{{ 'user.email' | i18n }}</th>
          <th>{{ 'user.lastLoginTime' | i18n }}</th>
          <th>{{ 'user.lastLoginIp' | i18n }}</th>
          <th>{{ 'user.startusing' | i18n }}</th>
          <th>{{ 'user.operate' | i18n }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of basicTable.data; let idx = index">
          <td>{{ idx + (currentPage - 1) * pageSize + 1 }}</td>
          <td>{{ data.name }}</td>
          <td>{{ data.account }}</td>
          <td>{{ data.roleName }}</td>
          <td>{{ data.mail }}</td>
          <td>{{ data.lastLoginTime }}</td>
          <td>{{ data.lastLoginIp }}</td>
          <td>
            <span [acl]="startusingAcl">
              <nz-switch nzSize="small" [ngModel]="data.deleteFlag === 0" (ngModelChange)="enableData(data)"></nz-switch>
            </span>
          </td>
          <td>
            <span *aclIf="editAcl">
              <a (click)="edit(data)">{{ 'user.edit' | i18n }}</a>
              <nz-divider nzType="vertical"></nz-divider>
            </span>

            <span *aclIf="passwordChangeAcl">
              <a (click)="updatePassword(data)">{{ 'user.changePassword' | i18n }}</a>
              <nz-divider nzType="vertical"></nz-divider>
            </span>
          </td>
        </tr>
      </tbody>
    </nz-table>
    <ng-template #totalTemplate let-total> {{ 'user.total' | i18n }}{{ total }} {{ 'user.record' | i18n }} </ng-template>
  </app-page-v2>`
})
export class PageComponent extends ListComponent implements OnInit {
  simpleSearchKeys = ['name', 'role'];
  advanceSearchForm = {
    properties: {
      name: { type: 'string', title: this.i18n.fanyi('user.name') },

      roleIdList: {
        type: 'number',
        title: this.i18n.fanyi('user.role'),
        ui: {
          widget: 'select',
          asyncData: () =>
            this.roleService.all().pipe(
              map(item => {
                return item.map((i: any) => {
                  return { label: i.name, value: [i.id] };
                });
              })
            ),
          allowClear: 'true'
        }
      },

      mail: { type: 'string', title: this.i18n.fanyi('user.email') },
      account: { type: 'string', title: this.i18n.fanyi('user.account') }
    },
    ui: {
      spanLabelFixed: 50,
      grid: {
        span: 8
      }
    }
  };

  operation: any;
  @AclById(53)
  startusingAcl: any;

  @AclById(54)
  editAcl: any;

  @AclById(56)
  passwordChangeAcl: any;

  @AclById(57)
  addUserAcl: any;

  @AclById(63)
  searchAcl: any;

  constructor(
    public userService: UserService,
    public nzModal: NzModalService,
    public acl: ACLService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService,
    private roleService: RoleService
  ) {
    super(userService, nzModal);
  }

  @ACLConfig()
  ngOnInit(): void {
    super.init();
    this.operation = [
      {
        text: this.i18n.fanyi('user.addUser'),
        acl: this.addUserAcl,
        icon: 'plus',
        onClick: () => {
          this.edit();
        }
      }
    ];
  }

  enableData(data: any) {
    if (data.deleteFlag === 0) {
      data.deleteFlag = 1;
    } else {
      data.deleteFlag = 0;
    }

    this.userService.enableAccount({ id: data.id, deleteFlag: data.deleteFlag })?.subscribe();
  }

  edit(data?: any) {
    super.openModal(
      data ? this.i18n.fanyi('user.edit') : this.i18n.fanyi('user.addUser'),
      this.i18n.fanyi('user.cancel'),
      this.i18n.fanyi('user.ok'),
      EditComponent,
      data
    );
  }

  updatePassword(data?: any) {
    super.openModal(
      this.i18n.fanyi('user.changePassword'),
      this.i18n.fanyi('user.cancel'),
      this.i18n.fanyi('user.ok'),
      PasswordEditComponent,
      data
    );
  }
}
