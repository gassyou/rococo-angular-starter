import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[authHost]'
})
export class AuthHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
