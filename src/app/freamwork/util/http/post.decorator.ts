import { DecoratorService } from "./../decorator.service";
import { ResponseData } from "./../../core/response-data";
import { DECORATORS, DecoratorTypes, GetConfig } from "./config.model";

export function Post(config: GetConfig, showError = true) {
  return (
    target: any,
    propOrMethod: string,
    descriptor?: PropertyDescriptor
  ) => {
    GetMethodDecorator(target, propOrMethod, descriptor, config, showError);
  };
}

function GetMethodDecorator(
  target: any,
  method: string,
  descriptor: PropertyDescriptor,
  config: GetConfig,
  showError: boolean
) {
  const http = DecoratorService.getHttpService();
  let url = config.url;

  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    let requestUrl = target[DECORATORS].filter(
      (decorator) =>
        decorator.type === DecoratorTypes.UrlParam &&
        decorator.method === method
    )
      .map((parameterDecorator) => {
        return {
          parameter: parameterDecorator.parameter,
          value: args[parameterDecorator.index] || "",
        };
      })
      .reduce((acc: string, curr: any) => {
        acc = acc.replace(`{${curr.parameter}}`, curr.value);
        return acc;
      }, url);

    let requestParams = target[DECORATORS].filter(
      (decorator) =>
        decorator.type === DecoratorTypes.RequestParam &&
        decorator.method === method
    )
      .map((decorator) => {
        const p: { [n: string]: any } = {};
        p[decorator.parameter] = args[decorator.index] || "";
        return p;
      })
      .reduce((acc: any, curr: any) => {
        acc = Object.assign(acc, acc, curr);
        return acc;
      }, {});

    let requestBody = target[DECORATORS].filter(
      (decorator) =>
        decorator.type === DecoratorTypes.RequestBody &&
        decorator.method === method
    )[0];

    const responseParamIndex = target[DECORATORS].filter(
      (decorator) =>
        decorator.type === DecoratorTypes.Response &&
        decorator.method === method
    )[0].index;

    this[method + "IsLoading"] = true;
    http
      .post(requestUrl, requestBody, requestParams)
      .subscribe((response: ResponseData) => {

        this[method + "IsLoading"] = false;
        if (showError && !response.meta.success) {
          DecoratorService.getMessageService().error(response.meta.message);
          return;
        }
        args[responseParamIndex] = response;
        originalMethod.apply(this, args);
        
      });
  };
}
