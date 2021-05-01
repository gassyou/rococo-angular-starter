import { Observable } from "rxjs";

export interface EditComponent {
  submit() : Observable<any>;
  cancel();
}
