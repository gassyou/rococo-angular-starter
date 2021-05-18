export function download(json: any, fileName: string) {
  if (json.byteLength === 0) {
    return false;
  }
  const downFile = function () {
    const blob = new Blob([json], {type: 'application/octet-stream'});
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display:none');
    a.setAttribute('href', objectUrl);
    a.setAttribute('download', fileName);
    a.click();
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      URL.revokeObjectURL(objectUrl);
    }
    return true;
  };
  return downFile();
}
