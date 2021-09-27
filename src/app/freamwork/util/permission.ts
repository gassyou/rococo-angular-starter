/**
 *
 * @param aclList 某操作需要的权限
 * @param messageInfo 非必须， 如果设置该参数时，当权限不符时，系统会提示此信息
 * 使用此权限控制时，需要注入 ACLService 和 NzMessageService。变量名为
 * acl和message
 */
export function UsingAcl(aclList: string[], messageInfo?: string) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function (...args) {
      const roleList = this.acl.data['roles'];

      if (hasPermission(roleList, aclList)) {
        return method.apply(this, args);
      } else {
        if (messageInfo) {
          this.message.error(messageInfo);
        }
      }
    };
  };
}

// permission : 该登录用户拥有的权限
// aclList: 某操作需要的权限，
export function hasPermission(permission: any[], aclList: any[]) {
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
