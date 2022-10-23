import { modalCreator } from "src/app/freamwork/util/modal-creator";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  Component,
  Inject,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";

import { AuthBaseComponent } from "./auth-base.component";
import { AuthHostDirective } from "./auth-host.directive";
import { AuthViewModel } from "../view-model/auth-view-model";
import { AuthModuleEditComponent } from "./auth-module-edit.component";
import { I18NService } from "src/app/core/service/i18n.service";
import { ALAIN_I18N_TOKEN } from "@delon/theme";
import { AuthPageEditComponent } from "./auth-page-edit.component";
import { FormComponent } from "src/app/freamwork/core/form-component";
import {
  AuthService,
} from "src/app/core/service/core/auth.service";
import { FunctionModel } from "src/app/routes/system-management/auth/entity/function-model";
import { AuthActionEditComponent } from "./auth-action-edit.componet";
import { AuthTabEditComponent } from "./auth-tab-edit.componet";
import {
  AclById,
  ACLConfig,
} from "src/app/freamwork/util/permission.decorator";
import { ACLService } from "@delon/acl";

@Component({
  selector: "app-module",
  template: `
    <div style="display:flex">
      <div class="type-icon">
        <span
          nz-icon
          style="font-size:16px"
          [nzType]="this.viewModel.titleIcon"
          nzTheme="outline"
        ></span>
      </div>
      <div
        class="title-bar"
        [style.background-color]="this.viewModel.titleBackgroundColor"
      >
        <span style="margin-top: auto;margin-bottom: auto;">
          <label
            class="title-content"
            nz-checkbox
            [ngModel]="this.viewModel.isChecked"
            (ngModelChange)="onFunctionChange()"
          >
            <span
              *ngIf="this.viewModel.icon"
              nz-icon
              [nzType]="this.viewModel.icon"
              nzTheme="outline"
              class="mr-sm ml-sm"
            ></span>
            {{ this.viewModel?.data.name | i18n }}
            <span style="color:#f3e5e5;font-weight:lighter;">
              (key:{{ this.viewModel.key }})
            </span>
          </label>
        </span>

        <span>

        <span  [acl]="addChildModuleAcl">
          <a *ngIf="this.viewModel.showModuleButton"
              class="btn"
              nz-button
              nzSize="small"
              nzType="link"
              (click)="addChildModule()"
            >
              {{ "auth.addChildModule" | i18n }}
            </a>
        </span>
          
        <span  [acl]="addPageAcl">
          <a *ngIf="this.viewModel.showPageButton"
            class="btn"
            nz-button
            nzSize="small"
            nzType="link"
            (click)="addPage()">
            {{ "auth.addPage" | i18n }}
          </a>
        </span>

        <span  [acl]="addTabAcl">
          <a *ngIf="this.viewModel.showTabButton"
            class="btn"
            nz-button
            nzSize="small"
            nzType="link"
            (click)="addTab()">
            {{ "auth.addTab" | i18n }}
          </a>
        </span>
          

        <span  [acl]="addActionAcl">
          <a *ngIf="this.viewModel.showActionButton"
            class="btn"
            nz-button
            nzSize="small"
            nzType="link"
            (click)="addAction()" >
            {{ "auth.addAction" | i18n }}
          </a>
        </span>  

          
        <span  [acl]="updeateModuleAndChildModuleAcl">
          <a class="btn"
            nz-button
            nzSize="small"
            nzType="link"
            (click)="update()" >
            {{ "common.update" | i18n }}
          </a>
        </span>  

        <span  [acl]="deleteModleAndChildModuleAcl">
          <a class="btn"
            nz-button
            nzSize="small"
            nzType="link"
            nz-popconfirm
            nzPopconfirmTitle="{{ 'common.delete-confirm' | i18n }}?"
            (nzOnConfirm)="deleteFunctoin()" >
            {{ "common.delete" | i18n }}
          </a>
        </span> 
          <a
            nzSize="small"
            [style.visibility]="
              this.viewModel.showCollapse ? 'unset' : 'hidden'
            "
            (click)="onExpand()"
          >
            <span
              style="font-size: 11px; color: #fff;"
              nz-icon
              [nzType]="!this.viewModel.isCollapsed ? 'up' : 'down'"
              nzTheme="outline"
            >
            </span>
          </a>
        </span>
      </div>
    </div>

    <div
      style="margin-left: 30px"
      [class]="this.viewModel.showActionContainer ? 'action-container' : ''"
      [style.display]="this.viewModel.isCollapsed ? 'none' : 'block'"
    >
      <ng-template authHost></ng-template>
    </div>
  `,
  styles: [
    `
      .title-bar {
        color: #fff;
        width: 100%;
        height: 28px;
        padding: 4px 12px;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
      }

      .title-content {
        color: #fff;
        font-weight: bold;
      }

      .btn {
        color: #f3e5e5;
      }

      .type-icon {
        margin-right: 2px;
        background-color: #2c5f7b;
        width: 28px;
        height: 28px;
        text-align: center;
        display: flex;
        align-items: center;
        color: #fff;
        justify-content: center;
      }

      .action-container {
        display: flex !important;
        min-height: 80px;
        padding: 12px;
      }
    `,
  ],
})
export class AuthModuleComponent implements OnInit, AuthBaseComponent {
  @Input()
  viewModel!: AuthViewModel;

  @ViewChild(AuthHostDirective, { static: true })
  set child(view: AuthHostDirective) {
    this.childViewRef = view.viewContainerRef;
  }

  childViewRef!: ViewContainerRef;

  constructor(
    protected modal: NzModalService,
    protected authService: AuthService,
    public acl: ACLService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService
  ) {}

  

  @AclById(87)
  updeateModuleAndChildModuleAcl : any;

  @AclById(81)
  addChildModuleAcl : any;

  @AclById(82)
  addPageAcl : any;

  @AclById(83)
  addTabAcl : any;

  @AclById(84)
  addActionAcl : any;

  @AclById(90)
  deleteModleAndChildModuleAcl : any;



  @ACLConfig()
  ngOnInit(): void {}

  onExpand() {
    if (this.viewModel.isCollapsed) {
      this.viewModel.expand();
    } else {
      this.viewModel.collapse();
    }
  }

  onFunctionChange() {
    this.viewModel.isChecked
      ? this.viewModel.setUnchecked()
      : this.viewModel.setChecked();
  }

  addChildModule() {
    modalCreator(
      this.modal,
      this.i18n.fanyi("auth.addModule"),
      this.i18n.fanyi("common.cancel"),
      this.i18n.fanyi("common.ok"),
      AuthModuleEditComponent,
      new FunctionModel({
        parentId: this.viewModel.data.id,
        parentText: this.viewModel.data.text,
        parentI18n: this.viewModel.data.i18n,
      })
    );
  }

  addPage() {
    modalCreator(
      this.modal,
      this.i18n.fanyi("auth.addPage"),
      this.i18n.fanyi("common.cancel"),
      this.i18n.fanyi("common.ok"),
      AuthPageEditComponent,
      new FunctionModel({
        parentId: this.viewModel.data.id,
        parentText: this.viewModel.data.text,
        parentI18n: this.viewModel.data.i18n,
      })
    );
  }

  addTab() {
    modalCreator(
      this.modal,
      this.i18n.fanyi("auth.addTab"),
      this.i18n.fanyi("common.cancel"),
      this.i18n.fanyi("common.ok"),
      AuthTabEditComponent,
      new FunctionModel({
        parentId: this.viewModel.data.id,
        parentText: this.viewModel.data.text,
        parentI18n: this.viewModel.data.i18n,
      })
    );
  }

  addAction() {
    modalCreator(
      this.modal,
      this.i18n.fanyi("auth.addTab"),
      this.i18n.fanyi("common.cancel"),
      this.i18n.fanyi("common.ok"),
      AuthActionEditComponent,
      new FunctionModel({
        parentId: this.viewModel.data.id,
        parentText: this.viewModel.data.text,
        parentI18n: this.viewModel.data.i18n,
      })
    );
  }

  deleteFunctoin() {
    const functionList: number[] = [];
    this.viewModel.fetchAllFunctionId(functionList);
    this.authService.deleteBatch(functionList)?.subscribe();
  }

  update() {
    const editComponentType: { [key: string]: Type<FormComponent> } = {
      module: AuthModuleEditComponent,
      page: AuthPageEditComponent,
      tab: AuthTabEditComponent,
      action: AuthActionEditComponent,
    };

    const titleI18n: { [key: string]: string } = {
      module: "auth.updeateModule",
      page: "auth.updeatePage",
      tab: "auth.updeateTab",
      action: "auth.updeateAction",
    };

    modalCreator(
      this.modal,
      this.i18n.fanyi(titleI18n[this.viewModel.data.moduleType]),
      this.i18n.fanyi("common.cancel"),
      this.i18n.fanyi("common.ok"),
      editComponentType[this.viewModel.data.moduleType],
      this.viewModel.data
    );
  }
}
