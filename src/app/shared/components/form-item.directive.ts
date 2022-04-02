import { Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[form-item]'
})
export class FormItemDirective {
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {
    // this.viewContainer.create
    // 正常模式显示
      // 添加必输标志
      // 默认下间距为 12px
    // 输入模式显示
      // 添加标签元素
      // 默认下间距为 12px
    // 错误显示模式
      // 添加错误信息元素
      // 将控边框改成红色
      // 取消下间距
  }
}
