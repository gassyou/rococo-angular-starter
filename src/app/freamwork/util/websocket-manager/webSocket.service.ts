import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { SendArgumentsType } from '../websocket-manager/message-ts-util';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocketSubject<MessageBody<Receive | Send>>;
  private received$ = new Subject<MessageBody<Receive>>();

  constructor(private message: NzMessageService) {}

  connect(url) {
    this.ws = webSocket({ url: url });
    this.ws.subscribe(
      data => {
        this.received$?.next(data as MessageBody<Receive>);
      },
      err => {
        if (err.type !== 'close') {
          this.message.error('无法链接到实时定位接口！');
        }
      }
    );
  }

  receive<K extends Receive>(type: K): Observable<MessageReceiveData[K]> {
    return this.received$.pipe(
      filter(message => message.type === type),
      map(message => {
        return message.data;
      })
    ) as Observable<MessageReceiveData[K]>;
  }

  send<K extends Send>(...args: SendArgumentsType<K>) {
    const [type, data] = args;
    this.ws?.next({
      type,
      data
    });
  }
}

export enum Receive {
  PING = '1001',
  LOCATION = '7201',
  LEAVE = '7401'
}

export enum Send {
  PONG = '1001',
  LEAVE = '2401'
}

type DataType<T extends Send | Receive> = T extends Send ? MessageSendData[Send] : MessageReceiveData[Receive];

export interface MessageBody<T extends Send | Receive> {
  type: T;
  data: DataType<T>;
}

export interface MessageReceiveData {
  [Receive.PING]: any;
  [Receive.LOCATION]: RealTimeLocation;
  [Receive.LEAVE]: any;
}

export interface MessageSendData {
  [Send.PONG]: any;
  [Send.LEAVE]: CloseConnection;
}

export interface RealTimeLocation {
  l: []; // [lng,lat]
  lt?: string; // 定位时间
  hd?: number; // 方向 0~360，以正北 0， 顺时针
  s?: number; // 时速 km/h
}

export interface CloseConnection {
  message: string;
}
