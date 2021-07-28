export interface SearchParams {
  currentPage?: number;
  pageSize?: number;
  sortName?: string;
  sortValue?: string;
  [index: string]: any;
}

export function isSearchParams(arg: any): arg is SearchParams {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    typeof arg.currentPage === 'number' &&
    typeof arg.pageSize === 'number' &&
    typeof arg.sortName === 'string' &&
    typeof arg.sortValue === 'string'
  );
}

export function combineSearchParams(existedParams: SearchParams, newValue: any): SearchParams {
  let params: SearchParams = { ...existedParams };

  if (!newValue) {
    return params;
  }

  for (const key in params) {
    if (newValue.hasOwnProperty(key)) {
      params[key] = newValue[key];
    }

    if (!newValue.hasOwnProperty(key) && key !== 'currentPage' && key !== 'pageSize' && key !== 'sortName' && key !== 'sortValue') {
      delete params[key];
    }
  }

  for (const key in newValue) {
    if (!params.hasOwnProperty(key)) {
      params[key] = newValue[key];
    }
  }

  return params;
}

export function returnDefaultSearchParams(arg: any): any {
  if (!arg) {
    return arg;
  }

  for (const key in arg) {
    if (key !== 'currentPage' && key !== 'pageSize' && key !== 'sortName' && key !== 'sortValue') {
      delete arg[key];
    }
  }
  return arg;
}
