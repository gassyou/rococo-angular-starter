import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { RoleService } from 'src/app/core/service/role.service';
import { FormComponent } from 'src/app/freamwork/core/form-component';

@Component({
  selector: 'app-edit',
  template: `
  <form nz-form [formGroup]="editForm" se-container="1" labelWidth="100" >
    <se label="角色名称" required [error]="{required: '请输入角色名称', maxLength:'名称最大不能超过20', serverError:'角色名称重复'}">
      <input nz-input formControlName="name" placeholder="请输入角色说明" />
    </se>
    <se label="角色说明" required [error]="{required: '请输入角色说明', serverError:'名称最大不能超过200'}">
      <nz-textarea-count [nzMaxCharacterCount]="200">
      <textarea rows="3" nz-input formControlName="detail" placeholder="请输入角色说明" ></textarea>
      </nz-textarea-count>
    </se>
  </form>
  `,
  styles: [
  ]
})
export class EditComponent extends FormComponent  implements OnInit {

  @Input()
  value:any;

  constructor(
    public roleService: RoleService,
    public fb:FormBuilder,
  ) {
    super(roleService);
   }

  ngOnInit(): void {
    this.isEdit = this.value ? true:false;
    this.editForm = this.fb.group({
      id: [this.value?this.value.id : null],
      name:[this.value?this.value.name: null,{
        validators:[Validators.required,Validators.maxLength(20)],
        asyncValidators: [this.checkRoleNameValidator.bind(this)],updateOn:'blur'}],

      detail:[this.value?this.value.detail: null, [Validators.maxLength(200)]]
      });
  }

  checkRoleNameValidator=(control : FormControl) : { [ key:string ] :any }=>{

    if(this.editForm && control.value){
      const param = {
        id: this.editForm.controls['id'].value,
        name: this.editForm.controls['name'].value
      };
      return this.roleService.asyncValidate('/role/check-name', param);
    }
    return of();
  }


}
