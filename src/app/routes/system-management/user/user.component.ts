import { Component, OnInit } from '@angular/core';
import { STColumn, STPage, STRes } from '@delon/abc/st';
import { SFSchema } from '@delon/form';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
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

  getUserListURL = '/users'

  searchParams: {name:string,roleName:string} = {name:'',roleName:''};
  searchForm : SFSchema = {
    properties: {
      name:{type: 'string',title:"姓名",},
      mobile: {type: 'string',title: "电话"},
    },
  };

  constructor() { }

  ngOnInit(): void {
  }

  addUser() {
    this.searchParams.name = 're';
    this.searchParams.roleName = '';
  }

}
