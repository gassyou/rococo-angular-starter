import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DELON_MODULES } from './delon.module';
import { ZORRO_MODULES } from './zorro.module';
import { AdvanceSearchComponent } from './components/advance-search/advance-search.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DelonFormModule } from '@delon/form';
import { FormsModule } from '@angular/forms';
import { PageContainerComponent } from './components/page-container.component';

@NgModule({
  declarations: [AdvanceSearchComponent, PageContainerComponent],
  imports: [
    CommonModule,
    ...ZORRO_MODULES,
    ...DELON_MODULES,
    OverlayModule,
    FormsModule,
    DelonFormModule.forRoot()
  ],
  exports: [
    AdvanceSearchComponent, PageContainerComponent,
    ...ZORRO_MODULES,
    ...DELON_MODULES
  ],
})
export class SharedModule { }
