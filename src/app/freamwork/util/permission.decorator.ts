import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DecoratorService } from "./decorator.service";

const ACL_DECORATORS = "__acl_decorators__";
const ACL_INFO_NAME = "acl_info_data";

export interface ActionCofing {
  module: string;
  action: string;
  tab: string;
}

export interface ActionPropertyCofing {
  name: string;
  config: ActionCofing;
}

/**
 * 这是一个方法装饰器。用来指定被装饰的方法执行时，需要的权限。
 * @param aclList 某操作需要的权限
 * @param messageInfo 非必须， 如果设置该参数时，当权限不符时，系统会提示此信息
 *
 */
export function UsingAcl(aclList: string[], messageInfo?: string) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function (...args) {
      const roleList = DecoratorService.getAclService().data["roles"];

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
        tab: tabName ? tabName : undefined,
      } as ActionCofing,
    });
  };
}

export function ACLConfig() {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    if (
      !target[ACL_DECORATORS] ||
      (target[ACL_DECORATORS] as ActionCofing[]).length <= 0
    ) {
      return;
    }

    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
      (target[ACL_DECORATORS] as ActionPropertyCofing[]).forEach((item) => {
        getAcl(
          item.config.module,
          item.config.action,
          item.config.tab
        ).subscribe((data) => (this[item.name] = data));
      });

      originalMethod.apply(this, args);
    };
  };
}

export function getAcl(
  moduleName: string,
  actionName: string,
  tabName?: string
): Observable<any[]> {
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
  return JSON.parse(localStorage.getItem(ACL_INFO_NAME));
}

export function removeACLInfoFromLocalStorage(): void {
  localStorage.removeItem(ACL_INFO_NAME);
}

export function hasAclInfoInLocalStorage(): boolean {
  return localStorage.hasItem(ACL_INFO_NAME);
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

function getAclByName(
  aclInfo: any[],
  moduleName: string,
  actionName: string,
  tabName?: string
): any[] {
  const aclObject = aclInfo.filter((item) => {
    return (
      item.pageName === moduleName &&
      (tabName ? item.tag === tabName : true) &&
      item.i18n === actionName
    );
  });

  if (!aclObject || aclObject.length <= 0 || !aclObject[0].acl) {
    return [];
  } else {
    return aclObject[0].acl.split(",");
  }
}
