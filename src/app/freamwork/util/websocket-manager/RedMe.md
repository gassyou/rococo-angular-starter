### use case 
```ts
 @MessageListener(Receive.PING)
  onConnect(data) {
    this.messageService.send<Send.PONG>(Send.PONG, data.data);
  }

  @MessageListener(Receive.LOCATION)
  onLocation(location: RealTimeLocation) {
    this.lastLocation = location;
  }

  @MessageListener(Receive.LEAVE)
  onLeave(data: any) {
    // 等待60秒后重新发起链接
    setTimeout(() => {
      this.connectWebSocket();
    }, 60 * 1000);
  }
```