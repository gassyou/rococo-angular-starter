import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { MainComponent } from './main/main.component';
import { PassportComponent } from './passport/passport.component';



@NgModule({
  declarations: [MainComponent, PassportComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
  ]
})
export class LayoutModule { }
