import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I18NService } from 'src/app/core/service/i18n.service';
import { MyApplicationService } from 'src/app/core/service/my-application.service';
import { CheckForm } from 'src/app/freamwork/util/form-valid-checker';

@Component({
  selector: 'app-login',
  template: `
    <div class="bg">
      <nz-card class="login_panel">
        <h1 class="title">{{ myApp.appName | i18n }}</h1>
        <form nz-form [formGroup]="loginForm">
          <nz-form-item>
            <nz-form-control nzErrorTip="{{ 'common.msg.requireErr' | i18n: { item: 'login.user' } }}">
              <nz-input-group nzPrefixIcon="user" nzSize="large">
                <input formControlName="account" nz-input placeholder="{{ 'login.user' | i18n }}" />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control nzErrorTip="{{ 'common.msg.requireErr' | i18n: { item: 'login.pw' } }}">
              <nz-input-group nzPrefixIcon="lock" [nzSuffix]="suffixTemplate" nzSize="large">
                <input
                  formControlName="password"
                  nz-input
                  [type]="passwordVisible ? 'text' : 'password'"
                  placeholder="{{ 'login.pw' | i18n }}"
                />
              </nz-input-group>
              <ng-template #suffixTemplate>
                <i nz-icon [nzType]="passwordVisible ? 'eye-invisible' : 'eye'" (click)="passwordVisible = !passwordVisible"></i>
              </ng-template>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item style="text-align: center">
            <nz-form-control>
              <label nz-checkbox formControlName="autoLogin">{{ 'login.autoLogin' | i18n }}</label>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <button [nzLoading]="islogining" nz-button nzSize="large" nzType="primary" (click)="login()" style="width: 100%">
              {{ 'login.login' | i18n }}
            </button>
          </nz-form-item>
        </form>
      </nz-card>
      <div></div>
    </div>
  `,
  styles: [
    `
      .bg {
        width: 100%;
        height: 100%;
        background-image: url('../../../assets/bg.png');
        background-size: cover;
      }
      .login_panel {
        width: 450px;
        margin-top: 280px;
        margin-left: 700px;
        padding: 24px;
        opacity: 0.8;
        position: absolute;
        top: 0;
        right: 200px;
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
  loginForm: FormGroup | undefined;
  passwordVisible = false;
  islogining = false;

  constructor(private fb: FormBuilder, public myApp: MyApplicationService, public i18n: I18NService) {}

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
    this.myApp.login(this.loginForm?.value).subscribe(() => {
      this.islogining = false;
    });
  }
}
