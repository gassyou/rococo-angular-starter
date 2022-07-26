import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';

import { AdvanceSearchV2Component } from './components/advance-search-v2.component';
import { AdvanceSearchComponent } from './components/advance-search.component';
import { FormItemDirective } from './components/form-item.directive';
import { PageContainerV2Component } from './components/page-container-v2.component';
import { PageContainerComponent } from './components/page-container.component';
import { DELON_MODULES } from './delon.module';
import { ZORRO_MODULES } from './zorro.module';

@NgModule({
  declarations: [
    AdvanceSearchComponent,
    AdvanceSearchV2Component,
    AdvanceSearchComponent,
    PageContainerComponent,
    PageContainerV2Component,
    FormItemDirective
  ],
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
  exports: [
    AdvanceSearchComponent,
    AdvanceSearchV2Component,
    FormItemDirective,
    PageContainerComponent,
    PageContainerV2Component,
    ...ZORRO_MODULES,
    ...DELON_MODULES
  ]
})
export class SharedModule {}
