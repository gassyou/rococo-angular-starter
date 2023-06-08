import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[form-item]',
    standalone: true
})
export class FormItemDirective implements AfterViewInit {
  labelElement: any;
  formControl: any;
  isRequired: boolean = false;

  @Input('required')
  set addRequiredMark(value: boolean) {
    this.isRequired = value;
    if (!this.formControl) {
      return;
    }
    if (value) {
      this.formControl.placeholder = `${this.formControl.placeholder} (必填)`;
    } else {
      this.formControl.placeholder = this.formControl.placeholder;
    }
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngAfterViewInit() {
    if (this.elementRef.nativeElement.hasAttribute('formcontrolname')) {
      this.formControl = this.elementRef.nativeElement;
    } else {
      this.formControl = this.elementRef.nativeElement.querySelector('[formcontrolname]');
    }

    const parentElement = this.elementRef.nativeElement.parentNode;
    if (this.isRequired && this.formControl) {
      this.formControl.placeholder = `${this.formControl.placeholder} (必填)`;
    }

    const div = this.renderer.createElement('div');
    div.style.position = 'relative';
    this.renderer.addClass(div, 'mb-md');
    this.renderer.appendChild(div, this.elementRef.nativeElement);
    this.renderer.appendChild(parentElement, div);
  }

  @HostListener('keydown', ['$event'])
  setLabel() {
    const parentElement = this.elementRef.nativeElement.parentNode;
    if (parentElement && parentElement.tagName.toUpperCase() === 'DIV' && !this.labelElement) {
      this.labelElement = this.renderer.createElement('label');
      this.renderer.addClass(this.labelElement, 'form-control-label');
      this.renderer.addClass(this.labelElement, 'form-control-label-focus');
      this.renderer.removeClass(this.labelElement, 'form-control-label-blue');
      this.renderer.appendChild(this.labelElement, this.renderer.createText(this.formControl.placeholder));
      this.renderer.appendChild(parentElement, this.labelElement);
      this.renderer.appendChild(parentElement.parentNode, parentElement);
      this.formControl.placeholder = '';
      this.formControl.style.paddingTop = '8px';
      this.formControl.focus();
    }
  }

  @HostListener('blur')
  formControlLostForcus() {
    console.log('test', this.labelElement);
    if (this.labelElement) {
      this.renderer.addClass(this.labelElement, 'form-control-label');
      this.renderer.addClass(this.labelElement, 'form-control-label-focus');
      this.renderer.removeClass(this.labelElement, 'form-control-label-blue');
    }
  }
}
