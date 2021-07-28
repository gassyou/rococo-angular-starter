import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DelonFormModule } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RoleService } from 'src/app/core/service/role.service';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ZORRO_MODULES } from 'src/app/shared/zorro.module';

import { EditComponent } from './edit.component';
import { PageComponent } from './page.component';
import { RoleRoutingModule } from './role-routing.module';


@NgModule({
  declarations: [PageComponent, EditComponent],
  imports: [CommonModule, RoleRoutingModule, SharedModule, FormsModule, ReactiveFormsModule, ZORRO_MODULES, DelonFormModule],
  providers: [NzModalService, NzMessageService, RoleService, { provide: CRUDService, useExisting: RoleService }]
})
export class RoleModule {}
