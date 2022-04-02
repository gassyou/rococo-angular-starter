import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RoleService } from 'src/app/core/service/role.service';
import { ListComponent } from 'src/app/freamwork/core/list-component';

import { EditDemoComponent } from './edit-demo.component';
import { EditComponent } from './edit.component';

@Component({
  selector: 'app-role-page',
  template: `
    <app-page [advanceSearchForm]="advanceSearchForm" [simpleSearchKeys]="simpleSearchKeys" [operations]="operation">
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
            <th>序号</th>
            <th>角色名称</th>
            <th>角色说明</th>
            <th>启用</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of basicTable.data">
            <td>{{ data.id }}</td>
            <td>{{ data.name }}</td>
            <td>{{ data.detail }}</td>
            <td>
              <nz-switch nzSize="small" [ngModel]="data.enable === 0" (ngModelChange)="enableData(data)"></nz-switch>
            </td>
            <td
              ><a (click)="edit(data)">编辑</a> <nz-divider nzType="vertical"></nz-divider>
              <a nz-popconfirm nzPopconfirmTitle="确认删除?" nzOkText="ok" nzCancelText="cancel" (nzOnConfirm)="deleteData(data)">删除</a>
            </td>
          </tr>
        </tbody>
      </nz-table>
      <ng-template #totalTemplate let-total> 共 {{ total }} 条记录 </ng-template>
    </app-page>
  `,
  styles: []
})
export class PageComponent extends ListComponent implements OnInit {
  simpleSearchKeys = ['name', 'detail'];
  advanceSearchForm = {
    properties: {
      name: { type: 'string', title: '名称' },
      detail: { type: 'string', title: '说明' }
    }
  };
  operation = [
    {
      text: '添加角色',
      onClick: () => {
        this.edit();
      }
    },
    { text: '导出', onClick: () => {} }
  ];

  constructor(public roleService: RoleService, public nzModal: NzModalService) {
    super(roleService, nzModal);
  }

  enableData(data: any) {
    if (data.enable === 0) {
      data.enable = 1;
    } else {
      data.enable = 0;
    }
    this.roleService.update(data)?.subscribe();
  }

  edit(data?: any) {
    super.openModal(data ? '编辑' : '添加角色', '取消', '确定', EditDemoComponent, data);
  }

  deleteData(data?: any) {
    this.roleService.delete(data.id)?.subscribe();
  }

  ngOnInit(): void {
    super.init();
  }
}
