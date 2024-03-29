import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DecoratorService } from './decorator.service';

const ACL_DECORATORS = '__acl_decorators__';
const ACL_INFO_NAME = 'acl_info_data';

export interface ActionCofing {
  id?: number;
  key?: string;
  module?: string;
  action?: string;
  tab?: string;
}

export interface ActionPropertyCofing {
  name: string;
  config: ActionCofing;
}

/**
 * 这是一个方法装饰器。用来指定被装饰的方法执行时，需要的权限。
 *
 * @param aclList 某操作需要的权限
 * @param messageInfo 非必须， 如果设置该参数时，当权限不符时，系统会提示此信息
 *
 */
export function UsingAcl(aclList: string[], messageInfo?: string) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function (...args: any) {
      const roleList = DecoratorService.getAclService().data['roles'];

      if (hasPermission(roleList, aclList)) {
        return method.apply(this, args);
      } else {
        if (messageInfo) {
          DecoratorService.getMessageService().error(messageInfo);
        }
      }
    };
  };
}

/**
 * 从缓存中获取某个按钮所需要的权限集合
 */
export function ACL(moduleName: string, actionName: string, tabName?: string) {
  return (target: any, key: string) => {
    if (!target[ACL_DECORATORS]) {
      target[ACL_DECORATORS] = [];
    }

    (target[ACL_DECORATORS] as ActionPropertyCofing[]).push({
      name: key,
      config: {
        module: moduleName,
        action: actionName,
        tab: tabName ? tabName : undefined
      } as ActionCofing
    });
  };
}

/**
 * 根据FunctionID，从缓存中获取某个按钮所需要的权限集合
 */
export function AclById(id: number) {
  return (target: any, key: string) => {
    if (!target[ACL_DECORATORS]) {
      target[ACL_DECORATORS] = [];
    }

    (target[ACL_DECORATORS] as ActionPropertyCofing[]).push({
      name: key,
      config: {
        id: id
      }
    });
  };
}

/**
 * 根据Function Key，从缓存中获取某个按钮所需要的权限集合
 */
export function AclByKey(functionKey: string) {
  return (target: any, key: string) => {
    if (!target[ACL_DECORATORS]) {
      target[ACL_DECORATORS] = [];
    }

    (target[ACL_DECORATORS] as ActionPropertyCofing[]).push({
      name: key,
      config: {
        key: functionKey
      }
    });
  };
}

export function ACLConfig() {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    if (!target[ACL_DECORATORS] || (target[ACL_DECORATORS] as ActionCofing[]).length <= 0) {
      return;
    }

    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any) {
      (target[ACL_DECORATORS] as ActionPropertyCofing[]).forEach(item => {
        if (item.config.id) {
          getAclById(item.config.id).subscribe(data => (this[item.name] = data));
        } else if (item.config.key) {
          getAclByKey(item.config.key).subscribe(data => (this[item.name] = data));
        } else {
          getAcl(item.config.module, item.config.action, item.config.tab).subscribe(data => (this[item.name] = data));
        }
      });

      originalMethod.apply(this, args);
    };
  };
}

export function getAclByKey(functionKey: string): Observable<any[]> {
  return DecoratorService.getMyAppService()
    .getACLInfo()
    .pipe(
      map((response: any[]) => {
        return getAclByFunctionKey(response, functionKey);
      })
    );
}

export function getAclById(functionId: number): Observable<any[]> {
  return DecoratorService.getMyAppService()
    .getACLInfo()
    .pipe(
      map((response: any[]) => {
        return getAclByFunctionID(response, functionId);
      })
    );
}

export function getAcl(moduleName: string | undefined, actionName: string | undefined, tabName?: string): Observable<any[]> {
  return DecoratorService.getMyAppService()
    .getACLInfo()
    .pipe(
      map((response: any[]) => {
        return getAclByName(response, moduleName, actionName, tabName);
      })
    );
}

export function saveAclInfoToLocalStorage(data: any[]) {
  localStorage.setItem(ACL_INFO_NAME, JSON.stringify(data));
}

export function getACLInfoFromLocalStorage(): any[] {
  const acl = localStorage.getItem(ACL_INFO_NAME);
  if (!acl) {
    return [];
  }
  return JSON.parse(acl);
}

export function removeACLInfoFromLocalStorage(): void {
  localStorage.removeItem(ACL_INFO_NAME);
}

export function hasAclInfoInLocalStorage(): boolean {
  return localStorage.getItem(ACL_INFO_NAME) !== null;
}

// permission : 该登录用户拥有的权限
// aclList: 某操作需要的权限，
export function hasPermission(permission: any[], aclList: any[]): boolean {
  // 如果某操作，没有指定任何权限，则不需要任何登录权限都可以访问
  if (!aclList || aclList.length === 0) {
    return true;
  }

  // 如果登录用户没有任何权限
  if (!permission || permission.length === 0) {
    return false;
  }

  // 判断用户拥有的权限中，是否有该操作所需权限
  // 只要有一个，则有该操作的权限
  for (const acl of aclList) {
    if (permission.includes(acl)) {
      return true;
    }
  }
  return false;
}

function getAclByFunctionKey(aclInfo: any[], funcitonKey: String): any[] {
  const aclObject = aclInfo.filter(item => {
    return item.key === funcitonKey;
  });
  if (!aclObject || aclObject.length <= 0 || !aclObject[0].acl) {
    return [];
  } else {
    return aclObject[0].acl;
  }
}

function getAclByFunctionID(aclInfo: any[], funcitonId: number): any[] {
  const aclObject = aclInfo.filter(item => {
    return item.id === funcitonId;
  });
  if (!aclObject || aclObject.length <= 0 || !aclObject[0].acl) {
    return [];
  } else {
    return aclObject[0].acl;
  }
}

function getAclByName(aclInfo: any[], moduleName: string | undefined, actionName: string | undefined, tabName?: string): any[] {
  if (!moduleName || !actionName) {
    return [];
  }

  const aclObject = aclInfo.filter(item => {
    return item.pageName === moduleName && (tabName ? item.tag === tabName : true) && item.i18n === actionName;
  });

  if (!aclObject || aclObject.length <= 0 || !aclObject[0].acl) {
    return [];
  } else {
    return aclObject[0].acl;
  }
}
