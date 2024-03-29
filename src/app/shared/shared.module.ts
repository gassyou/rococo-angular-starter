import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';

import { AdvanceSearchV2Component } from './components/advance-search-v2.component';
import { AdvanceSearchComponent } from './components/advance-search.component';
import { FixedTableHeaderDirective } from './components/fixed-table-header.directive';
import { FormItemDirective } from './components/form-item.directive';
import { PageContainerV2Component } from './components/page-container-v2.component';
import { PageContainerComponent } from './components/page-container.component';
import { DELON_MODULES } from './delon.module';
import { ZORRO_MODULES } from './zorro.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ...ZORRO_MODULES,
        ...DELON_MODULES,
        OverlayModule,
        DelonFormModule.forRoot(),
        AlainThemeModule.forChild(),
        DelonACLModule,
        RouterModule,
        AdvanceSearchComponent,
        AdvanceSearchV2Component,
        AdvanceSearchComponent,
        PageContainerComponent,
        PageContainerV2Component,
        FormItemDirective,
        FixedTableHeaderDirective
    ],
    exports: [
        AdvanceSearchComponent,
        AdvanceSearchV2Component,
        FormItemDirective,
        FixedTableHeaderDirective,
        PageContainerComponent,
        PageContainerV2Component,
        ...ZORRO_MODULES,
        ...DELON_MODULES
    ]
})
export class SharedModule {}
