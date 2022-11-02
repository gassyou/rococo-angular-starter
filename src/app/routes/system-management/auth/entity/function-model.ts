import { TreeDataSource } from 'src/app/freamwork/util/tree/tree-datasource';

export class FunctionModel extends TreeDataSource {
  public moduleType!: 'module' | 'page' | 'tab' | 'action';
  public text!: string;
  public i18n?: string;
  public parentText?: string;
  public parentI18n?: string;
  public link?: string;
  public icon?: string;
  public hide?: number; // 0： 显示 1 : 隐藏
  public reuse?: number; // 0: 不允许 1：允许
  public groupFlag?: number; // 0: 不是菜单组 1：是菜单组
  public hideInBreadcrumb?: number; // 0: 显示 1：隐藏
  public sortNumber?: number;
  public remark?: string;
  public version?: number;
  public acl?: number[];

  constructor(value: any) {
    super(value);
    Object.assign(this, value);
  }
  get parentName(): string {
    let name = this.parentI18n ? this.parentI18n : this.parentText;
    return name ? name : 'common.none';
  }

  get name(): string {
    return this.i18n ? this.i18n : this.text;
  }
}
