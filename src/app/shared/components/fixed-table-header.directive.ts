import { Directive, ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFixedTableHeader]'
})
export class FixedTableHeaderDirective implements AfterViewInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}
  ngAfterViewInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, 'fix-table-header');
  }
}
