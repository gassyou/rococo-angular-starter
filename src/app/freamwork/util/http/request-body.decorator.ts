import { DECORATORS, DecoratorTypes } from "./config.model";

export function Body() {
    return function (target: any, propertyKey: string, parameterIndex: number) {
        if (target[DECORATORS]) {
            (target[DECORATORS] as any[]).push({ type: DecoratorTypes.RequestBody, method: propertyKey, parameter: null, index: parameterIndex});
        } else {
            target[DECORATORS] = [];
            (target[DECORATORS] as any[]).push({ type: DecoratorTypes.RequestBody, method: propertyKey, parameter: null, index: parameterIndex});
        }
    }
}