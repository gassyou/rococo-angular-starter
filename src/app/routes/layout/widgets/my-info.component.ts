import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { MyInfo } from 'src/app/freamwork/core/application.service';
import { CheckForm } from 'src/app/freamwork/util/form-valid-checker';

@Component({
  selector: 'app-my-info',
  template: `
    <form nz-form [formGroup]="myForm">
      <div nz-row class="info-div">
        <label nz-col [nzSm]="12" [nzXs]="12" class="info-label">
          <i nz-icon nzType="idcard"></i>
          &nbsp;アカウント
        </label>

        <label nz-col [nzSm]="12" [nzXs]="12" style="text-align: right">
          {{ value ? (value.account ? value.account : '') : '' }}
        </label>
      </div>
      <div nz-row class="info-div">
        <label nz-col [nzSm]="12" [nzXs]="12" class="info-label">
          <i nz-icon nzType="user"></i>
          &nbsp;名前
        </label>

        <label nz-col [nzSm]="12" [nzXs]="12" style="text-align: right" *ngIf="!isEdit">
          {{ value ? (value.name ? value.name : '') : '' }}&nbsp;
        </label>

        <ng-container *ngIf="isEdit">
          <nz-form-control nzErrorTip="名前は20文字以内にお願いします">
            <input nz-input formControlName="name" placeholder="名前を入力してください" />
          </nz-form-control>
        </ng-container>
      </div>

      <div nz-row class="info-div">
        <label nz-col [nzSm]="12" [nzXs]="12" class="info-label">
          <i nz-icon nzType="phone"></i>
          &nbsp;電話
        </label>

        <label nz-col [nzSm]="12" [nzXs]="12" style="text-align: right" *ngIf="!isEdit">
          {{ value ? (value.phone ? value.phone : '') : '' }}&nbsp;
        </label>

        <ng-container *ngIf="isEdit">
          <nz-form-control nzErrorTip="11桁の数字を入力してください!">
            <input nz-input formControlName="phone" placeholder="電話を入力してください" />
          </nz-form-control>
        </ng-container>
      </div>

      <div nz-row class="info-div">
        <label nz-col [nzSm]="12" [nzXs]="12" class="info-label">
          <i nz-icon nzType="team" nzTheme="outline"></i>
          &nbsp;役割
        </label>
        <label nz-col [nzSm]="12" [nzXs]="12" style="text-align: right">
          {{ value ? (value.roleName ? value.roleName : '') : '' }}
        </label>
      </div>

      <div nz-row class="operation-div">
        <button *ngIf="!isEdit" nz-button title="編集" nzType="primary" (click)="isEdit = true" class="ml-sm">
          <i nz-icon nzType="edit"></i>
        </button>

        <ng-container *ngIf="isEdit">
          <button nz-button title="保存" nzType="primary" (click)="saveMyInfo()" class="ml-sm">
            <i nz-icon nzType="save"></i>
          </button>
          <button nz-button title="キャンセル" (click)="isEdit = false">
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

  myForm: FormGroup | undefined;

  isEdit = false;
  constructor(public app: MyApplicationService, public fb: FormBuilder) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: [this.value?.name, [Validators.maxLength(32), Validators.required]],
      phone: [
        this.value?.phone,
        [
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/)
        ]
      ]
    });
  }

  @CheckForm('myForm')
  saveMyInfo() {
    if (!this.value || !this.value?.id) {
      return;
    }

    const value = {
      id: this.value?.id,
      name: this.myForm?.controls['name'].value,
      phone: this.myForm?.controls['phone'].value
    };

    this.app.editMyInfo(value).subscribe((response: any) => {
      if (response.meta.success) {
        this.isEdit = false;
        if (this.value) {
          this.value.name = value.name;
          this.value.phone = value.phone;
        }
      }
    });
  }
}

export interface UserInfo {
  userName: string;
  name: string;
  phone: string;
  roleName: string;
}
