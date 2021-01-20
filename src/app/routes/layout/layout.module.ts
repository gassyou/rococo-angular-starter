import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { LayoutDefaultModule } from '@delon/theme/layout-default';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderUserComponent } from './widgets/header-user.component';

@NgModule({
  declarations: [MainComponent, HeaderUserComponent],
  imports: [
    CommonModule,
    LayoutDefaultModule,
    RouterModule,
    SharedModule,

  ],
  providers: [NzMessageService]
})
export class LayoutModule { }
