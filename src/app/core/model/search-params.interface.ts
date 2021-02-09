export interface SearchParams {
  currentPage?: number;
  pageSize?: number;
  sortName?: string;
  sortValue?: string;
  [index: string]: any
}

export function isSearchParams(arg: any): arg is SearchParams {
  return arg !== null &&
    typeof arg === "object" &&
    typeof arg.currentPage === "number" &&
    typeof arg.pageSize === "number" &&
    typeof arg.sortName === "string" &&
    typeof arg.sortValue === "string";
}


export function returnDefaultSearchParams(arg: any) : any {

  if(!arg) {
    return arg;
  }

  for (const key in arg) {
    if(
      key !== "currentPage" &&
      key !== "pageSize" &&
      key !== "sortName" &&
      key !== "sortValue"
    ) {
      delete arg[key];
    }
  }
  return arg;

}
