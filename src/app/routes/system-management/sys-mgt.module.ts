import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { SysMgtRoutingModule } from './sys-mgt-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    SysMgtRoutingModule,
    SharedModule,
  ]
})
export class SysmMgtModule { }
