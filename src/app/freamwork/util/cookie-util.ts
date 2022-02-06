export function setCookie(name: any, value: any, exdays = 7) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};${expires}`;
}

export function delCookie(name: any) {
  setCookie(name, '', -1);
}

export function getCookie(name: any) {
  const cookieItems = document.cookie.split(';');
  for (let i = 0; i < cookieItems.length; i++) {
    const item = cookieItems[i].split('=');
    if (item[0].trim() === name && item[1] && item[1].length > 0) {
      return item[1];
    }
  }
  return '';
}
