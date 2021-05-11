import { FormComponent } from 'src/app/freamwork/core/form-component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SFComponent, SFSchema, SFSelectWidgetSchema } from '@delon/form';
import { RoleService } from 'src/app/core/service/role.service';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'user-edit',
  template: `
      <sf #sf
      [schema]="form"
      button="none"
      compact="true">
    </sf>
  `,
  providers: [RoleService,UserService]
})
export class EditComponent implements FormComponent, OnInit {

  form : SFSchema = {
    properties: {
      name: {type: 'string',title:"姓名",maxLength: 20,ui: {
        errors: {
          'required': '必填项'
        }
      }},
      role: {
        type: 'integer',
        title:"角色",
        ui: {
          widget: 'select',
          asyncData: ()=> this.roleService.all().pipe(
            map( result => {
                return result.records.map( data => { return { label: data.name, value: data.id} } );
            })
          )
        } as SFSelectWidgetSchema,
      },
      mobile: {type: 'string',title: "电话", ui: {
        validator: val => (!val ? [{ keyword: 'required', message: 'Required mobile' }] : []),
      }},
    },
  };

  @ViewChild('sf', {static:true}) sf :SFComponent;

  constructor(
    public roleService: RoleService,
    public userService: UserService,
  ) { }

  ngOnInit(): void {

  }

  submit(): Observable<any> {
    this.sf.validator();
    if(this.sf.valid) {
      return this.userService.add(this.sf.value);
    }
    return null;
  }

  cancel() {

  }

}
