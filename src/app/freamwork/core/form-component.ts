import { Observable } from "rxjs";
export interface FormComponent {
  submit() : Observable<any>;
  cancel();
}
