import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SysMgtRoutingModule } from './sys-mgt-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ZORRO_MODULES } from 'src/app/shared/zorro.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserModule,
    RoleModule,
    SysMgtRoutingModule,
    SharedModule,
    ZORRO_MODULES,
  ],
  providers: [NzModalService, NzMessageService]
})
export class SysmMgtModule { }
