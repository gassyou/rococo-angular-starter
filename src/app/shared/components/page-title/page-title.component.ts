import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-page-title',
  template: `
    <div class="alain-default__content-title">
      <nz-breadcrumb [nzAutoGenerate]="true"></nz-breadcrumb>
      <div>
          <ng-container *ngTemplateOutlet="searchBar"></ng-container>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class PageTitleComponent implements OnInit {

  constructor() { }

  @Input() searchBar: TemplateRef<void>;

  ngOnInit(): void {
  }

}
