import { DecoratorService } from '../decorator.service';
import { ResponseData } from './../../core/response-data';
import { DECORATORS, DecoratorTypes, GetConfig } from './config.model';

export function Get(config: GetConfig, showError = true) {
  return (target: any, propOrMethod: string, descriptor?: PropertyDescriptor) => {
    !descriptor
      ? GetPropertyDecorator(target, propOrMethod, config)
      : GetMethodDecorator(target, propOrMethod, descriptor, config, showError);
  };
}

function GetPropertyDecorator(target: any, prop: string, config: GetConfig) {
  if (config.url && config.url.match(/{\w*}/)) throw new Error(`@Get: Dynamic parameters in the url are not allowed for properties`);

  if (!target[prop]) {
    DecoratorService.getHttpService()
      .get(config.url)
      .subscribe((response: ResponseData) => {
        if (response.meta.success) {
          Object.defineProperty(target, prop, {
            get: () => {
              return response.data;
            },
            set: (value: any) => {
              throw new Error(`@Get: The property ${prop} cannot be set. Remove the @Get decorator.`);
            }
          });
        } else {
          DecoratorService.getMessageService().error(response.meta.message);
        }
      });
  }
}

function GetMethodDecorator(target: any, method: string, descriptor: PropertyDescriptor, config: GetConfig, showError: boolean) {
  const http = DecoratorService.getHttpService();
  let url = config.url;

  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    let requestUrl = target[DECORATORS].filter(decorator => decorator.type === DecoratorTypes.UrlParam && decorator.method === method)
      .map(parameterDecorator => {
        return {
          parameter: parameterDecorator.parameter,
          value: args[parameterDecorator.index] || ''
        };
      })
      .reduce((acc: string, curr: any) => {
        acc = acc.replace(`{${curr.parameter}}`, curr.value);
        return acc;
      }, url);

    let requestParams = target[DECORATORS].filter(
      decorator => decorator.type === DecoratorTypes.RequestParam && decorator.method === method
    )
      .map(decorator => {
        const p: { [n: string]: any } = {};
        p[decorator.parameter] = args[decorator.index] || '';
        return p;
      })
      .reduce((acc: any, curr: any) => {
        acc = Object.assign(acc, acc, curr);
        return acc;
      }, {});

    const responseParamIndex = target[DECORATORS].filter(
      decorator => decorator.type === DecoratorTypes.Response && decorator.method === method
    )[0].index;

    this[`${method}IsLoading`] = true;
    http.get(requestUrl, requestParams).subscribe((response: ResponseData) => {
      this[`${method}IsLoading`] = false;
      if (showError && !response.meta.success) {
        DecoratorService.getMessageService().error(response.meta.message);
        return;
      }
      args[responseParamIndex] = response;
      originalMethod.apply(this, args);
    });
  };
}
