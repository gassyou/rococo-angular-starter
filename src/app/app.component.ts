import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { VERSION as VERSION_ALAIN } from '@delon/theme';
import { VERSION as VERSION_ZORRO } from 'ng-zorro-antd/version';

import { DecoratorService } from './freamwork/util/decorator.service';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `
})
export class AppComponent {
  constructor(el: ElementRef, renderer: Renderer2, service: DecoratorService) {
    renderer.setAttribute(el.nativeElement, 'ng-alain-version', VERSION_ALAIN.full);
    renderer.setAttribute(el.nativeElement, 'ng-zorro-version', VERSION_ZORRO.full);
  }
}
