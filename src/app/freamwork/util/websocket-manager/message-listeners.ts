import { takeUntil } from 'rxjs/operators';

import { MessageListenersManager } from './message-listeners-manager';
import { ReceiveArgumentsType } from './message-ts-util';
import { MessageReceiveData } from './webSocket.service';

export function MessageListener<T extends keyof MessageReceiveData>(type: T) {
  return (target: MessageListenersManager, propertyKey: string, descriptor: TypedPropertyDescriptor<ReceiveArgumentsType<T>>) => {
    const constructor = Object.getPrototypeOf(target).constructor;
    if (constructor && constructor.__messageListeners__) {
      constructor.__messageListeners__.push(function () {
        this.messageService
          .receive(type)
          .pipe(takeUntil(this.__messageListenersTakeUntilDestroy$__))
          .subscribe(data => {
            descriptor.value.call(this, data);
          });
      });
    }
    return descriptor;
  };
}
