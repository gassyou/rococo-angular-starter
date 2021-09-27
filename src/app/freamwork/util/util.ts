/**
 * null , undefined ,{} 对象，都返回 true
 */
export function isVoidObject(o) {
  return o === null || o === undefined || Object.keys(o).length <= 0;
}
