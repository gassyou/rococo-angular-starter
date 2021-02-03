import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DELON_MODULES } from './delon.module';
import { ZORRO_MODULES } from './zorro.module';
import { AdvanceSearchComponent } from './components/advance-search/advance-search.component';


@NgModule({
  declarations: [AdvanceSearchComponent],
  imports: [
    CommonModule,

    ... ZORRO_MODULES,
    ... DELON_MODULES
  ],
  exports: [
    AdvanceSearchComponent,
    ... ZORRO_MODULES,
    ... DELON_MODULES
  ]
})
export class SharedModule { }
