export function download(octetData: any, fileName: string) {
  if (octetData.byteLength === 0) {
    return false;
  }
  const downFile = function () {
    const blob = new Blob([octetData], {type: 'application/octet-stream'});
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
