import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlainThemeModule } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ZORRO_MODULES } from 'src/app/shared/zorro.module';

import { RoleModule } from './role/role.module';
import { SysMgtRoutingModule } from './sys-mgt-routing.module';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, UserModule, RoleModule, SysMgtRoutingModule, SharedModule, ZORRO_MODULES, AlainThemeModule.forChild()],
  providers: [NzModalService, NzMessageService]
})
export class SysmMgtModule {}
