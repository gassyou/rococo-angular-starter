import { FormComponent } from 'src/app/freamwork/core/form-component';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SFSchema, SFSelectWidgetSchema } from '@delon/form';
import { RoleService } from 'src/app/core/service/role.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'user-edit',
  template: `
      <sf #sf
      [schema]="form"
      button="none"
      compact="true">
    </sf>
  `,
  providers: [RoleService]
})
export class EditComponent implements FormComponent, OnInit {

  form : SFSchema = {
    properties: {
      name: {type: 'string',title:"姓名",},
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
      mobile: {type: 'string',title: "电话"},
    },
  };

  constructor(
    public roleService: RoleService,
  ) { }

  ngOnInit(): void {

  }

  submit(): Observable<any> {
    return null;
  }

  cancel() {

  }

}
