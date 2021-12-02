import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';

import { AdvanceSearchComponent } from './components/advance-search/advance-search.component';
import { PageContainerComponent } from './components/page-container.component';
import { DELON_MODULES } from './delon.module';
import { ZORRO_MODULES } from './zorro.module';

@NgModule({
  declarations: [AdvanceSearchComponent, PageContainerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ...ZORRO_MODULES,
    ...DELON_MODULES,
    OverlayModule,
    DelonFormModule.forRoot(),
    DelonACLModule,
    RouterModule
  ],
  exports: [AdvanceSearchComponent, PageContainerComponent, ...ZORRO_MODULES, ...DELON_MODULES]
})
export class SharedModule {}
