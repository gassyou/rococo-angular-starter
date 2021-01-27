import { Component, OnInit } from '@angular/core';
import { STColumn } from '@delon/abc/st';

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
    {title: '启用', index:'enable'},
    {title: '操作', index:'id'},
  ];

  getUserListURL = '/users'

  searchParams = {}

  constructor() { }

  ngOnInit(): void {
  }

}
