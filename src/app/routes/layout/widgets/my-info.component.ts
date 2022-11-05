import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/service/core/user.service';
import { I18NService } from 'src/app/core/service/i18n.service';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { MyInfo } from 'src/app/freamwork/core/application.service';
import { CheckForm } from 'src/app/freamwork/util/form-valid-checker';
import { emptyValidator } from 'src/app/shared/empty.validator';

@Component({
  selector: 'app-my-info',
  template: `
    <form nz-form [formGroup]="myForm">
      <div nz-row class="info-div">
        <label nz-col [nzSm]="12" [nzXs]="12" class="info-label">
          <i nz-icon nzType="idcard"></i>
          &nbsp;{{ 'user.account' | i18n }}
        </label>

        <label nz-col [nzSm]="12" [nzXs]="12" style="text-align: right">
          {{ value ? (value.account ? value.account : '') : '' }}
        </label>
      </div>
      <div nz-row class="info-div">
        <label nz-col [nzSm]="12" [nzXs]="12" class="info-label">
          <i nz-icon nzType="user"></i>
          &nbsp;{{ 'user.name' | i18n }}
        </label>

        <label nz-col [nzSm]="12" [nzXs]="12" style="text-align: right" *ngIf="!isEdit">
          {{ value ? (value.name ? value.name : '') : '' }}&nbsp;
        </label>

        <ng-container *ngIf="isEdit">
          <nz-form-item style="width:100%">
            <nz-form-control [nzErrorTip]="nameErrorTpl">
              <input nz-input formControlName="name" placeholder="{{ 'user.name' | i18n }}" />
              <ng-template #nameErrorTpl let-control>
                <ng-container *ngIf="control.hasError('maxlength')">
                  {{ 'common.msg.maxLengthErr' | i18n: { item: 'user.name', length: 20 } }}
                </ng-container>
                <ng-container *ngIf="control.hasError('required')">
                  {{ 'common.msg.requireErr' | i18n: { item: 'user.name' } }}
                </ng-container>
                <ng-container *ngIf="control.hasError('empty')">
                  {{ 'common.msg.emptyErr' | i18n }}
                </ng-container>
              </ng-template>
            </nz-form-control>
          </nz-form-item>
        </ng-container>
      </div>

      <div nz-row class="info-div">
        <label nz-col [nzSm]="12" [nzXs]="12" class="info-label">
          <i nz-icon nzType="mail"></i>
          &nbsp;{{ 'user.email' | i18n }}
        </label>

        <label nz-col [nzSm]="12" [nzXs]="12" style="text-align: right" *ngIf="!isEdit">
          {{ value ? (value.mail ? value.mail : '') : '' }}&nbsp;
        </label>

        <ng-container *ngIf="isEdit">
          <nz-form-item style="width:100%">
            <nz-form-control [nzErrorTip]="mailErrorTpl">
              <input nz-input formControlName="mail" placeholder="{{ 'user.email' | i18n }}" />

              <ng-template #mailErrorTpl let-control>
                <ng-container *ngIf="control.hasError('maxlength')">
                  {{ 'common.msg.maxLengthErr' | i18n: { item: 'user.email', length: 100 } }}
                </ng-container>
                <ng-container *ngIf="control.hasError('required')">
                  {{ 'common.msg.requireErr' | i18n: { item: 'user.email' } }}
                </ng-container>
                <ng-container *ngIf="control.hasError('empty')">
                  {{ 'common.msg.emptyErr' | i18n }}
                </ng-container>
                <ng-container *ngIf="control.hasError('serverError')">
                  {{ myForm?.controls['mail'].errors.serverError }}
                </ng-container>
              </ng-template>
            </nz-form-control>
          </nz-form-item>
        </ng-container>
      </div>

      <div nz-row class="info-div">
        <label nz-col [nzSm]="12" [nzXs]="12" class="info-label">
          <i nz-icon nzType="team" nzTheme="outline"></i>
          &nbsp;{{ 'user.role' | i18n }}
        </label>
        <label nz-col [nzSm]="12" [nzXs]="12" style="text-align: right">
          {{ value ? (value.roleName ? value.roleName : '') : '' }}
        </label>
      </div>

      <div nz-row class="operation-div">
        <button *ngIf="!isEdit" nz-button title="{{ 'common.edit' | i18n }}" nzType="primary" (click)="isEdit = true" class="ml-sm">
          <i nz-icon nzType="edit"></i>
        </button>

        <ng-container *ngIf="isEdit">
          <button nz-button title="{{ 'common.save' | i18n }}" nzType="primary" (click)="saveMyInfo()" class="ml-sm">
            <i nz-icon nzType="save"></i>
          </button>
          <button nz-button title="{{ 'common.cancel' | i18n }}" (click)="cancel()">
            <i nz-icon nzType="close"></i>
          </button>
        </ng-container>
      </div>
    </form>
  `,
  styles: [
    `
      .anticon:before {
        display: block;
        font-size: 17px;
      }

      .info-label {
        text-align: left;
        font-weight: bold;
      }

      .info-div {
        border-bottom: 1px solid rgb(233, 233, 233);
        padding-bottom: 8px;
        padding-top: 8px;
      }

      .operation-div {
        padding-bottom: 8px;
        padding-top: 8px;
        justify-content: center;
      }
    `
  ]
})
export class MyInfoComponent implements OnInit {
  @Input()
  value: MyInfo | undefined;

  myForm: UntypedFormGroup | undefined;

  isEdit = false;
  constructor(
    public app: MyApplicationService,
    public fb: UntypedFormBuilder,
    @Inject(ALAIN_I18N_TOKEN) public i18n: I18NService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: [this.value?.name, [Validators.maxLength(20), Validators.required, emptyValidator]],
      phone: [
        this.value?.phone,
        [
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/)
        ]
      ],
      mail: [
        this.value?.mail,
        {
          Validators: [Validators.maxLength(100), Validators.required, emptyValidator],
          asyncValidators: [this.checkEmailValidator.bind(this)],
          updateOn: 'blur'
        }
      ]
    });
  }

  checkEmailValidator = (control: UntypedFormControl): { [key: string]: any } => {
    if (!control.value) {
      return of();
    }

    if (this.myForm && control.value) {
      const param = {
        id: this.value?.id,
        mail: this.myForm.controls['mail'].value
      };
      return this.userService.asyncValidate('sys-user/is-mail-unique', param);
    }
    return of();
  };

  @CheckForm('myForm')
  saveMyInfo() {
    if (!this.value || !this.value?.id) {
      return;
    }

    const value = {
      id: this.value?.id,
      name: this.myForm?.controls['name'].value,
      // phone: this.myForm?.controls["phone"].value,
      mail: this.myForm?.controls['mail'].value
    };

    this.app.editMyInfo(value).subscribe((response: any) => {
      if (response.meta.success) {
        this.isEdit = false;
        if (this.value) {
          this.value.name = value.name;
          this.value.mail = value.mail;
          // this.value.phone = value.phone;
        }
      }
    });
  }

  cancel() {
    this.isEdit = false;
    this.myForm?.controls['name'].setValue(this.value?.name);
    this.myForm?.controls['mail'].setValue(this.value?.mail);
  }
}

export interface UserInfo {
  userName: string;
  name: string;
  phone: string;
  mail: string;
  roleName: string;
}
