import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DelonFormModule } from '@delon/form';

import { AdvanceSearchComponent } from './components/advance-search/advance-search.component';
import { PageContainerComponent } from './components/page-container.component';
import { DELON_MODULES } from './delon.module';
import { ZORRO_MODULES } from './zorro.module';

@NgModule({
  declarations: [AdvanceSearchComponent, PageContainerComponent],
  imports: [CommonModule, ...ZORRO_MODULES, ...DELON_MODULES, OverlayModule, FormsModule, DelonFormModule.forRoot()],
  exports: [AdvanceSearchComponent, PageContainerComponent, ...ZORRO_MODULES, ...DELON_MODULES]
})
export class SharedModule {}
