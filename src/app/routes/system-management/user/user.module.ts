import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { ZORRO_MODULES } from 'src/app/shared/zorro.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DelonFormModule } from '@delon/form';
import { UserRoutingModule } from './user-routing.module';
import { PageComponent } from './page.component';
import { EditComponent } from './edit.component';

@NgModule({
  declarations: [PageComponent, EditComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FormsModule,
    ZORRO_MODULES,
    DelonFormModule,
  ],
  providers: [NzModalService, NzMessageService]
})
export class UserModule { }
