export const DECORATORS = '__decorators__';

export interface HttpConfig {
  url: string;
}
export interface GetConfig extends HttpConfig {}
export interface PutConfig extends HttpConfig {}

export interface UrlConfing {
  name: string;
  default?: string;
}

export enum DecoratorTypes {
  UrlParam = 'UrlParam',
  RequestParam = 'RequestParam',
  RequestBody = 'RequestBody',
  Get = 'GetProp',
  GetMethod = 'GetMethod',
  Post = 'PostProp',
  PostMethod = 'PostMethod',
  PutMehtod = 'PutMethod',
  Response = 'Response'
}
