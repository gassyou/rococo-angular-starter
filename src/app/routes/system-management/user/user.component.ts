import { Component, OnInit } from '@angular/core';
import { SFSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CRUDService } from 'src/app/core/service/crud.service';
import { UserService } from 'src/app/core/service/user.service';
import { PageAndSort } from 'src/app/shared/components/page-and-sort';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
  providers: [{provide: CRUDService, useClass: UserService}]
})
export class UserComponent extends PageAndSort implements OnInit  {

  searchParams = ['name','role'];
  searchForm : SFSchema = {
    properties: {
      name: {type: 'string',title:"姓名",},
      role: {type: 'string',title:"角色",},
      mobile: {type: 'string',title: "电话"},
    },
  };

  userList: any[] = [];

  constructor(private userService: CRUDService) {
    super(userService);
  }


  ngOnInit(): void {
    this.userService.datasource$.subscribe(
      result => {
        this.userList = result.data.records;
        this.total = result.data.total;
      }
    );

    this.userService.search({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    });
  }

  addUser() {

  }

}
