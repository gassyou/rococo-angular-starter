import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DELON_MODULES } from './delon.module';
import { ZORRO_MODULES } from './zorro.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    ... ZORRO_MODULES,
    ... DELON_MODULES
  ],
  exports: [
    ... ZORRO_MODULES,
    ... DELON_MODULES
  ]
})
export class SharedModule { }
