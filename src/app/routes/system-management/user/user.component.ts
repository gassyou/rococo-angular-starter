import { Component, OnInit } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { SearchParams } from 'src/app/core/model/search-params.interface';
import { CRUDService } from 'src/app/core/service/crud.service';
import { UserService } from 'src/app/core/service/user.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
  providers: [{provide: CRUDService, useClass: UserService}]
})
export class UserComponent implements OnInit {

  searchParams = ['name','role'];
  searchForm : SFSchema = {
    properties: {
      name:{type: 'string',title:"姓名",},
      role:{type: 'string',title:"角色",},
      mobile: {type: 'string',title: "电话"},
    },
  };

  userList: any[] = [];
  total: number = 0;
  currentPage = 1;
  pageSize = 5;

  constructor(private userService: CRUDService) { }

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

  tableChange() {
    const params: SearchParams = {... this.userService.params};
    params.pageSize = this.pageSize;
    params.currentPage = this.currentPage;
    this.userService.search(params);
  }

}
