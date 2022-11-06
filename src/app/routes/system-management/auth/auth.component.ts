import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService, viewModelFactory } from 'src/app/core/service/core/auth.service';
import { RoleService } from 'src/app/core/service/core/role.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { ListComponent } from 'src/app/freamwork/core/list-component';
import { AclByKey, ACLConfig } from 'src/app/freamwork/util/permission.decorator';
import { buildTree } from 'src/app/freamwork/util/tree/tree';
import { FunctionModel } from 'src/app/routes/system-management/auth/entity/function-model';

import { AuthHostDirective } from './component/auth-host.directive';
import { AuthModuleEditComponent } from './component/auth-module-edit.component';
import { AuthViewModel } from './view-model/auth-view-model';

@Component({
  selector: 'app-auth',
  template: `<app-page-v2>
    <div class="operation">
      <nz-select [ngModel]="selectRole" (ngModelChange)="changeRole($event)" style="width:200px" class="mr-sm">
        <nz-option *ngFor="let item of roleList" [nzValue]="item" [nzLabel]="item.name"></nz-option>
      </nz-select>
      <span [acl]="updateAcl">
        <button [nzLoading]="updateLoading" nz-button nzType="primary" (click)="updateAuth()">
          <span nz-icon nzType="sync" nzTheme="outline"></span>
          {{ 'common.action.update' | i18n }}
        </button>
      </span>
      <span [acl]="addModuleAcl">
        <a nz-button nzType="link" (click)="addModule()">{{ 'auth.addModule' | i18n }}</a>
      </span>
    </div>

    <div class="content">
      <ng-template authHost></ng-template>
    </div>
  </app-page-v2>`,
  styles: [
    `
      .operation {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-end;
        margin-bottom: 12px;
      }
      .content {
        background-color: #fff;
        height: calc(100vh - 190px);
        padding: 24px;
        overflow-y: auto;
      }
    `
  ],
  providers: [AuthHostDirective]
})
export class AuthComponent extends ListComponent implements OnInit {
  selectRole: any;
  roleList: any[] = [];
  actionModuleList: AuthViewModel[] = [];
  updateLoading: boolean = false;

  @ViewChild(AuthHostDirective, { static: true })
  parentHost!: AuthHostDirective;

  constructor(
    public modalService: NzModalService,
    public authService: AuthService,
    private roleService: RoleService,
    public nzContextMenuService: NzContextMenuService,
    public acl: ACLService,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService
  ) {
    super(authService, modalService);
  }

  @AclByKey('')
  updateAcl: any;

  @AclByKey('')
  addModuleAcl: any;

  @ACLConfig()
  ngOnInit(): void {
    this.roleService.all()?.subscribe(data => {
      this.roleList = data;
      this.selectRole = this.roleList[0];
    });
    super.dataSourceSubscription = super
      .initWithObservable()
      .pipe(
        switchMap((functionData: FunctionModel[], index: number) => {
          const roleObservable = this.roleList && this.roleList.length > 0 ? of(this.roleList) : this.roleService.all();

          if (!roleObservable) {
            return of({
              roleData: [],
              functionData: functionData
            });
          }

          return roleObservable.pipe(
            map((roleData: any[]) => {
              return {
                roleData: roleData,
                functionData: functionData
              };
            })
          );
        })
      )
      .subscribe((result: any) => {
        this.roleList = result.roleData;
        this.selectRole = this.roleList[0];

        result.functionData = (result.functionData as FunctionModel[]).map(item => {
          return new FunctionModel(item);
        });
        this.actionModuleList = [...buildTree<AuthViewModel>(result.functionData, viewModelFactory)];
        this.parentHost.viewContainerRef.clear();
        this.actionModuleList.forEach(item => {
          item.createComponent(this.parentHost.viewContainerRef, false);
          item.changeCheckStatus(this.selectRole?.functionId);
        });
      });
  }

  changeRole(value: any) {
    this.selectRole = value;
    this.actionModuleList.forEach(item => {
      item.changeCheckStatus(this.selectRole?.functionId);
    });
  }

  addModule() {
    super.openModal(
      this.i18n.fanyi('auth.addModule'),
      this.i18n.fanyi('common.action.cancel'),
      this.i18n.fanyi('common.action.ok'),
      AuthModuleEditComponent,
      null,
      '700px'
    );
  }

  updateAuth() {
    if (!this.selectRole || !this.selectRole.id) {
      return;
    }
    const functionIdList: number[] = [];

    this.actionModuleList.forEach(item => {
      item.fetchAllFunctionId(functionIdList, true);
    });

    const param = {
      roleId: this.selectRole.id,
      functionIdList: functionIdList
    };

    this.updateLoading = true;
    this.authService.updateAuth(param).subscribe(() => {
      this.updateLoading = false;
    });
  }
}
