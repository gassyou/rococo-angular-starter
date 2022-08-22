import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DelonFormModule } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RoleService } from 'src/app/core/service/core/role.service';
import { UserService } from 'src/app/core/service/core/user.service';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ZORRO_MODULES } from 'src/app/shared/zorro.module';

import { EditComponent } from './edit.component';
import { PageComponent } from './page.component';
import { PasswordEditComponent } from './password-edit.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [PageComponent, EditComponent, PasswordEditComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule, FormsModule, ReactiveFormsModule, ZORRO_MODULES, DelonFormModule],
  providers: [NzModalService, NzMessageService, UserService, RoleService, { provide: CRUDService, useExisting: UserService }]
})
export class UserModule {}
