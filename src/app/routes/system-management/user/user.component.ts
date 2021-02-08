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

  columns: STColumn[] = [
    {title: '序号', type:'no'},
    {title: '姓名', index:'name'},
    {title: '角色', index:'roleName'},
    {title: '最后登录时间', index:'lastLoginTime'},
    {title: '最后登录IP', index:'lastLoginIP'},
    {title: '启用', index:'enable', render:'enable'},
    {title: '操作', buttons:[
      {text: '编辑',icon:'edit', type:'modal',modal:{}},
      {text: '密码修改', icon:'lock', type:'modal',modal:{}},
      {text: '删除', icon:'delete', type:'del',pop:{title:'确定删除此用户？',okType:'danger',okText:'删除'},click:(record)=>{console.log(record.id)}}
    ]},
  ];

  searchParams: {name:string,roleName:string} = {name:'',roleName:''};
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
      sortName: null,
      sortValue: null
    });
  }

  addUser() {
    this.searchParams.name = 're';
    this.searchParams.roleName = '';
  }

  tableChange(value) {

    if(value.type === "pi") {

      const param: SearchParams = {
        currentPage: value.pi,
        pageSize: value.ps,
        sortName: null,
        sortValue: null
      };
      this.userService.search(param);
    }

    if(value.type === "ps") {

      this.currentPage = 1;
      const param: SearchParams = {
        currentPage: this.currentPage,
        pageSize: value.ps,
        sortName: null,
        sortValue: null
      };
      this.userService.search(param);
    }

  }

}
