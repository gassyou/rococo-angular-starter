import { Component, OnInit } from '@angular/core';
import { SFSchema } from '@delon/form';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { UserService } from 'src/app/core/service/user.service';
import { BasicComponent } from 'src/app/freamwork/core/basic-component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
  providers: [{provide: CRUDService, useClass: UserService}]
})
export class UserComponent extends BasicComponent implements OnInit  {

  simpleSearchKeys = ['name','role'];
  searchForm : SFSchema = {
    properties: {
      name: {type: 'string',title:"姓名",},
      role: {type: 'string',title:"角色",},
      mobile: {type: 'string',title: "电话"},
    },
  };
  constructor(
    public userService: CRUDService,
    public nzModal: NzModalService
    ) {
    super(userService, nzModal);
  }

  ngOnInit(): void {
    super.init();
  }

  addUser() {

  }

}
