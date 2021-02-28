import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DELON_MODULES } from './delon.module';
import { ZORRO_MODULES } from './zorro.module';
import { AdvanceSearchComponent } from './components/advance-search/advance-search.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DelonFormModule } from '@delon/form';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AdvanceSearchComponent, PageTitleComponent],
  imports: [
    CommonModule,

    ... ZORRO_MODULES,
    ... DELON_MODULES,
    OverlayModule,
    FormsModule,
    DelonFormModule.forRoot()
  ],
  exports: [
    AdvanceSearchComponent,
    PageTitleComponent,
    ... ZORRO_MODULES,
    ... DELON_MODULES
  ],
})
export class SharedModule { }
