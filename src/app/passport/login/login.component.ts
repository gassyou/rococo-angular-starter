import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { CheckForm } from 'src/app/freamwork/util/form-valid-checker';

@Component({
  selector: 'app-login',
  template: `
    <nz-card class="login_panel">
      <h1 class="title">資生堂クーポン管理システム</h1>
      <form nz-form [formGroup]="loginForm">
        <nz-form-item>
          <nz-form-control nzErrorTip="ユーザ名を入力してください">
            <nz-input-group nzPrefixIcon="user" nzSize="large">
              <input formControlName="account" nz-input placeholder="ユーザ名" />
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control nzErrorTip="パスワードを入力してください">
            <nz-input-group nzPrefixIcon="lock" [nzSuffix]="suffixTemplate" nzSize="large">
              <input formControlName="password" nz-input [type]="passwordVisible ? 'text' : 'password'" placeholder="パスワード" />
            </nz-input-group>
            <ng-template #suffixTemplate>
              <i nz-icon [nzType]="passwordVisible ? 'eye-invisible' : 'eye'" (click)="passwordVisible = !passwordVisible"></i>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="text-align: center">
          <nz-form-control>
            <label nz-checkbox formControlName="autoLogin">次回自動ログイン</label>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <button [nzLoading]="islogining" nz-button nzSize="large" nzType="primary" (click)="login()" style="width: 100%">
            {{ islogining ? 'ログイン中…' : 'ログイン' }}
          </button>
        </nz-form-item>
      </form>
    </nz-card>
  `,
  styles: [
    `
      .login_panel {
        width: 450px;
        margin-top: 280px;
        margin-left: 600px;
        padding: 24px;
        opacity: 0.8;
        position: absolute;
        top: 0;
        right: 350px;
      }

      .title {
        text-align: center;
        width: 100%;
        margin-bottom: 24px;
      }
    `
  ]
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup | undefined;
  passwordVisible = false;
  islogining = false;

  constructor(private fb: UntypedFormBuilder, private myApp: MyApplicationService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      account: [null, [Validators.required]],
      password: [null, [Validators.required]],
      autoLogin: [false]
    });
  }

  @CheckForm('loginForm')
  login() {
    this.islogining = true;
    this.myApp.login(this.loginForm?.value).subscribe(
      () => {
        this.islogining = false;
      },
      () => {
        this.islogining = false;
      }
    );
  }
}
