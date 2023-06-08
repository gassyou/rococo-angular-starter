import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[authHost]',
    standalone: true
})
export class AuthHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
