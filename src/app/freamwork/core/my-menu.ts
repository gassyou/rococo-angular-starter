import { FunctionModel } from '../../routes/system-management/auth/entity/function-model';
import { Tree } from '../util/tree/tree';

export class MyMenu implements Tree {
  isLeaf?: boolean;
  isTopNode?: boolean;

  [key: string]: any;
  id?: number;
  text?: string | undefined;
  i18n?: string | undefined;
  group?: boolean | undefined;
  link?: string | undefined;
  externalLink?: string | undefined;
  hide?: boolean | undefined;
  hideInBreadcrumb?: boolean | undefined;
  acl?: number[];
  reuse?: boolean;
  icon?: string | undefined;
  children: MyMenu[] = [];
  key?: string;

  constructor(functionModel: FunctionModel) {
    this.key = `${functionModel.id}`;
    this.text = functionModel.text ? functionModel.text : '';
    this.i18n = functionModel.i18n ? functionModel.i18n : '';
    this.link = functionModel.link ? functionModel.link : undefined;
    this.group = functionModel.groupFlag === 1;
    this.hideInBreadcrumb = functionModel.hideInBreadcrumb === 1;
    this.hide = functionModel.hide === 1;
    this.acl = functionModel.acl;
    this.reuse = functionModel.reuse === 1;
    this.id = functionModel.id;
    this.icon = functionModel.icon ? functionModel.icon : undefined;
    this.isLeaf = functionModel.isLeaf;
    this.isTopNode = functionModel.isTopNode;
  }

  fillInChildren(datasource: FunctionModel[]) {
    if (!this.isLeaf && datasource != null && datasource.length > 0) {
      datasource.forEach((item: FunctionModel) => {
        if (!item.isTopNode && item.parentId === this.id) {
          this.children.push(new MyMenu(item));
        }
      });
    }
    if (this.children.length > 0) {
      this.children.forEach(child => {
        child.fillInChildren(datasource);
      });
    }
  }
}
