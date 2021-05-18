import { Component, OnInit } from '@angular/core';
import { ListComponent } from 'src/app/freamwork/core/list-component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditComponent } from './edit.component';
import { PasswordEditComponent } from './password-edit.component';
import { UserService } from 'src/app/core/service/user.service';

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
      [nzLoading]="userService.tableDataLoading"
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
            <nz-switch nzSize="small" [ngModel]="data.enable===0" (ngModelChange)="enableData(data)"></nz-switch>
          </td>
          <td><a (click)="edit(data)">编辑</a>
            <nz-divider nzType="vertical"></nz-divider> <a (click)="updatePassword(data)">密码修改</a>
            <nz-divider nzType="vertical"></nz-divider> <a nz-popconfirm nzPopconfirmTitle="确认删除?" nzOkText="ok" nzCancelText="cancel" (nzOnConfirm)="deleteData(data)"
      >删除</a>
          </td>
        </tr>
      </tbody>
    </nz-table>
    <ng-template #totalTemplate let-total> 共 {{ total }} 条记录 </ng-template>
  </app-page>`
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
    {text:'添加用户',onClick: ()=>{this.edit()}},
    {text:'导出',onClick: ()=>{}},
  ];

  constructor(
    public userService: UserService,
    public nzModal: NzModalService,
    ) {
    super(userService, nzModal);
  }

  ngOnInit(): void {
    super.init();
  }

  enableData(data) {
    if(data.enable === 0) {
      data.enable = 1;
    } else {
      data.enable = 0;
    }
    this.userService.update(data).subscribe();
  }

  edit(data?: any) {
    this.openModal(
      data?"编辑":"添加用户",
      "取消",
      "确定",
      EditComponent,
      data
    )
  }

  deleteData(data?: any) {
    this.userService.delete(data.id).subscribe();
  }

  updatePassword(data?: any) {
    this.openModal("修改密码","取消","确定",PasswordEditComponent,data);
  }


}
