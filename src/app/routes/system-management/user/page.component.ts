import { Component, OnInit } from '@angular/core';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { UserService } from 'src/app/core/service/user.service';
import { ListComponent } from 'src/app/freamwork/core/list-component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from './edit.component';

@Component({
  selector: 'user-list',
  template: `
  <app-page [advanceSearchForm]="advanceSearchForm" [simpleSearchKeys]="simpleSearchKeys" [operations]="operation">
    <nz-table #basicTable
      [nzData]="tableDataSource"
      nzShowQuickJumper="true"
      nzShowSizeChanger="true"
      [nzShowTotal]="totalTemplate"
      nzFrontPagination="false"
      [nzTotal]="total"
      [(nzPageSize)]="pageSize"
      [(nzPageIndex)]="currentPage"
      [nzPageSizeOptions]="pageSizeOptions"
      (nzPageIndexChange)="onPageIndexChange()"
      (nzPageSizeChange)="onPageSizeChange()">
      <thead>
        <tr>
          <th>序号</th>
          <th>姓名</th>
          <th>手机</th>
          <th>角色</th>
          <th>最后登录时间</th>
          <th>最后登录IP</th>
          <th>启用</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of basicTable.data">
          <td>{{ data.id }}</td>
          <td>{{ data.name }}</td>
          <td>{{ data.mobile }}</td>
          <td>{{ data.roleName }}</td>
          <td>{{ data.lastLoginTime }}</td>
          <td>{{ data.lastLoginIP }}</td>
          <td>
            <nz-switch nzSize="small" [ngModel]="data.enable===0"></nz-switch>
          </td>
          <td> <a>编辑</a>
            <nz-divider nzType="vertical"></nz-divider> <a>密码修改</a>
            <nz-divider nzType="vertical"></nz-divider> <a>删除</a>
          </td>
        </tr>
      </tbody>
    </nz-table>
    <ng-template #totalTemplate let-total> 共 {{ total }} 条记录 </ng-template>
  </app-page>`,
  providers: [
    {provide: CRUDService, useClass: UserService},
  ]
})
export class PageComponent extends ListComponent implements OnInit  {

  simpleSearchKeys = ['name','role'];
  advanceSearchForm = {
    properties: {
      name: {type: 'string',title:"姓名",},
      role: {type: 'string',title:"角色",},
      mobile: {type: 'string',title: "电话"},
    }
  };
  operation = [
    {text:'添加用户',onClick: ()=>{this.openModal("添加用户","取消","确定",EditComponent)}},
  ];

  constructor(
    public userService: CRUDService,
    public nzModal: NzModalService,
    ) {
    super(userService, nzModal);
  }

  ngOnInit(): void {
    super.init();
  }
}
