import { Type, ViewContainerRef } from '@angular/core';
import { viewModelFactory } from 'src/app/core/service/core/auth.service';
import { Tree } from 'src/app/freamwork/util/tree/tree';
import { FunctionModel } from 'src/app/routes/system-management/auth/entity/function-model';

import { AuthBaseComponent } from '../component/auth-base.component';

export abstract class AuthViewModel implements Tree {
  public rank = 1;
  public titleBackgroundColor = 'hsl(220, 50%, 50%)';

  public isCollapsed = false;
  public isChecked = false;

  public abstract add(component: AuthViewModel): void;
  public abstract getChildren(): AuthViewModel[];

  constructor(public component: Type<AuthBaseComponent>, public data: FunctionModel) {}

  get key(): string {
    return `${this.data.id}`;
  }

  get showCollapse(): boolean {
    return this.getChildren() && this.getChildren().length > 0;
  }

  get titleIcon(): string {
    if (this.data.moduleType === 'module') {
      return 'appstore';
    }
    if (this.data.moduleType === 'page') {
      return 'file';
    }
    return 'folder';
  }

  get icon(): string {
    if (this.data.icon) {
      return this.data.icon.split('anticon-')[1];
    } else {
      return '';
    }
  }

  get showModuleButton(): boolean {
    return this.data.moduleType === 'module' && this.data.isTopNode;
  }

  get showPageButton(): boolean {
    return this.data.moduleType === 'module';
  }

  get showTabButton(): boolean {
    return this.data.moduleType === 'page';
  }

  get showActionButton(): boolean {
    return this.data.moduleType === 'page' || this.data.moduleType === 'tab';
  }

  get showActionContainer(): boolean {
    return this.hasChildren && (this.data.moduleType === 'page' || this.data.moduleType === 'tab');
  }

  get hasChildren(): boolean {
    return this.getChildren && this.getChildren.length > 0;
  }

  public fetchAllFunctionId(result: number[], onlyChecked: boolean = false) {
    if (!result) {
      return;
    }

    if (onlyChecked) {
      if (this.isChecked) {
        result.push(this.data.id);
      }
    } else {
      result.push(this.data.id);
    }

    if (this.getChildren() && this.getChildren().length > 0) {
      this.getChildren().forEach(child => {
        child.fetchAllFunctionId(result, onlyChecked);
      });
    }
  }

  public expand() {
    if (this.isCollapsed) {
      this.isCollapsed = false;
    }
  }

  public collapse() {
    if (!this.isCollapsed) {
      this.isCollapsed = true;
    }
  }

  public setChecked(): void {
    if (!this.isChecked) {
      this.isChecked = true;
    }
    if (this.getChildren() && this.getChildren().length > 0) {
      this.getChildren().forEach((item: AuthViewModel) => {
        item.setChecked();
      });
    }
  }

  public setUnchecked(): void {
    if (this.isChecked) {
      this.isChecked = false;
    }

    if (this.getChildren() && this.getChildren().length > 0) {
      this.getChildren().forEach((item: AuthViewModel) => {
        item.setUnchecked();
      });
    }
  }

  public changeCheckStatus(roleFunList: number[]) {
    this.isChecked = roleFunList && roleFunList.includes(this.data.id);

    if (this.getChildren() && this.getChildren().length > 0) {
      this.getChildren().forEach(child => {
        child.changeCheckStatus(roleFunList);
      });
    }
  }

  public createComponent(viewRef: ViewContainerRef, clearContainer = true) {
    if (!viewRef) {
      return;
    }

    if (clearContainer) {
      viewRef.clear();
    }

    const componentRef = viewRef.createComponent<AuthBaseComponent>(this.component);

    componentRef.instance.viewModel = this;

    if (this.getChildren() && this.getChildren().length > 0) {
      this.getChildren().forEach((child: AuthViewModel) => {
        child.createComponent(componentRef.instance.childViewRef, false);
      });
    }
  }

  public fillInChildren(datasource: FunctionModel[]): void {
    if (!this.data.isLeaf && datasource != null && datasource.length > 0) {
      datasource.forEach((item: FunctionModel) => {
        if (!item.isTopNode && item.parentId === this.data.id) {
          this.add(viewModelFactory(item));
        }
      });
    }
    this.getChildren().forEach(child => child.fillInChildren(datasource));
  }
}
