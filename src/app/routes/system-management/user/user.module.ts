import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZORRO_MODULES } from 'src/app/shared/zorro.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DelonFormModule } from '@delon/form';
import { UserRoutingModule } from './user-routing.module';
import { PageComponent } from './page.component';
import { EditComponent } from './edit.component';
import { RoleService } from 'src/app/core/service/role.service';
import { UserService } from 'src/app/core/service/user.service';
import { CRUDService } from 'src/app/freamwork/core/crud.service';
import { PasswordEditComponent } from './password-edit.component';

@NgModule({
  declarations: [PageComponent, EditComponent, PasswordEditComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ZORRO_MODULES,
    DelonFormModule,
  ],
  providers: [
    NzModalService,
    NzMessageService,
    UserService,
    RoleService,
    {provide: CRUDService,useExisting:UserService}
  ]
})
export class UserModule { }
