import { RoutesRoutingModule } from './routes-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { MenuService } from '@delon/theme';
import { SharedModule } from '../shared/shared.module';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RoutesRoutingModule,
    LayoutModule,
    SharedModule,
    FormsModule,
  ],
  providers: [MenuService, NzModalService],
})
export class RoutesModule { }
