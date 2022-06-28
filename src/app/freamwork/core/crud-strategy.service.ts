import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

import { CRUDService } from './crud.service';
import { SearchParams } from './search-params.interface';

export abstract class CRUDStrategyService extends CRUDService {
  private current: CRUDService | undefined = undefined;
  private serviceMode: string = '';

  public get mode(): string {
    return this.serviceMode;
  }

  public set mode(value: string) {
    this.serviceMode = value;
    this.current = this.serviceFactory(value);
  }

  public abstract serviceFactory(type: string): CRUDService;

  public all(): Observable<any> | null {
    return this.current ? this.current.all() : null;
  }

  public search(query?: SearchParams | any) {
    this.current?.search(query);
  }

  public add(param: any): Observable<any> | null {
    return this.current ? this.current.add(param) : null;
  }

  public update(param: any): Observable<any> | null {
    return this.current ? this.current.update(param) : null;
  }

  public delete(id: number): Observable<any> | null {
    return this.current ? this.current.delete(id) : null;
  }

  public export(): Observable<any> | null {
    return this.current ? this.current.export() : null;
  }

  public asyncValidate(checkUrl: string, params: any): Observable<any> {
    if (this.current) {
      return this.current.asyncValidate(checkUrl, params);
    } else {
      return of(null);
    }
  }

  public asyncValidateGet(checkUrl: string, params: any): Observable<any> {
    if (this.current) {
      return this.current.asyncValidateGet(checkUrl, params);
    } else {
      return of(null);
    }
  }
}
