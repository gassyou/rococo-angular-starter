import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleRoutingModule } from './role-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZORRO_MODULES } from 'src/app/shared/zorro.module';
import { PageComponent } from './page.component';
import { DelonFormModule } from '@delon/form';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoleService } from 'src/app/core/service/role.service';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { EditComponent } from './edit.component';


@NgModule({
  declarations: [
    PageComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ZORRO_MODULES,
    DelonFormModule,
  ],
  providers: [
    NzModalService,
    NzMessageService,
    RoleService,
  ]
})
export class RoleModule { }
