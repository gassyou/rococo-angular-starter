import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { SysMgtRoutingModule } from './sys-mgt-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { ZORRO_MODULES } from 'src/app/shared/zorro.module';


@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    SysMgtRoutingModule,
    SharedModule,
    FormsModule,
    ZORRO_MODULES,
  ],
  providers: [NzModalService]
})
export class SysmMgtModule { }
