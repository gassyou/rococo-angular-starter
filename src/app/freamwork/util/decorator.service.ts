import { Injectable } from '@angular/core';
import { ACLService } from '@delon/acl';
import { TokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MyApplicationService } from 'src/app/core/service/my-application.service';

@Injectable()
export class DecoratorService {
  private static http: _HttpClient;
  private static message: NzMessageService;
  private static acl: ACLService;
  private static token: TokenService;
  private static app: MyApplicationService;

  public constructor(http: _HttpClient, message: NzMessageService, acl: ACLService, token: TokenService, app: MyApplicationService) {
    DecoratorService.http = http;
    DecoratorService.message = message;
    DecoratorService.acl = acl;
    DecoratorService.token = token;
    DecoratorService.app = app;
  }
  public static getHttpService() {
    if (!DecoratorService.http) {
      throw new Error('DecoratorService not initialized');
    }
    return DecoratorService.http;
  }
  public static getMessageService() {
    if (!DecoratorService.message) {
      throw new Error('DecoratorService not initialized');
    }
    return DecoratorService.message;
  }
  public static getAclService() {
    if (!DecoratorService.acl) {
      throw new Error('DecoratorService not initialized');
    }
    return DecoratorService.acl;
  }

  public static getTokenService() {
    if (!DecoratorService.token) {
      throw new Error('DecoratorService not initialized');
    }
    return DecoratorService.token;
  }

  public static getMyAppService() {
    if (!DecoratorService.app) {
      throw new Error('DecoratorService not initialized');
    }
    return DecoratorService.app;
  }
}
