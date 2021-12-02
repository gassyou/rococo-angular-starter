import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { WebSocketService } from './webSocket.service';
@Component({
  template: ''
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class MessageListenersManager implements OnDestroy {
  // tslint:disable-next-line
  static __messageListeners__: Function[] = [];
  // tslint:disable-next-line
  readonly __messageListenersTakeUntilDestroy$__ = new Subject<void>();

  constructor(public messageService: WebSocketService) {
    while (MessageListenersManager.__messageListeners__.length > 0) {
      const fun = MessageListenersManager.__messageListeners__.pop();
      fun.apply(this);
    }
  }

  ngOnDestroy(): void {
    this.__messageListenersTakeUntilDestroy$__.next();
    this.__messageListenersTakeUntilDestroy$__.complete();
  }
}
