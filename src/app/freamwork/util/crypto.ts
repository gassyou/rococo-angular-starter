import * as CryptoJS from 'crypto-js';

const encryptKey: string = 'hr12!@#$20192099';
const secret_passphrase = CryptoJS.enc.Utf8.parse(encryptKey);

export function encrypt(text: String): String {
  try {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key128Bits500Iterations = CryptoJS.PBKDF2(secret_passphrase, salt, {
      keySize: 128 / 8,
      iterations: 500
    });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const options = { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
    const password_text = CryptoJS.enc.Utf8.parse(text);
    const password_encrypted = CryptoJS.AES.encrypt(password_text, key128Bits500Iterations, options);
    let password_binary = CryptoJS.enc.Hex.stringify(salt);
    password_binary += `,${CryptoJS.enc.Hex.stringify(iv)}`;
    password_binary += `,${password_encrypted}`;

    return btoa(password_binary);
  } catch (error) {
    console.error('Password encryption failed!');
    return '';
  }
}

export function encryptForServer(text: string): string {
  try {
    const password_text = CryptoJS.enc.Utf8.parse(text);
    const iv_text = getRandomData();
    const iv = CryptoJS.enc.Utf8.parse(iv_text);
    const password_binary = btoa(
      CryptoJS.AES.encrypt(password_text, secret_passphrase, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString()
    );
    return btoa(`${password_binary},${btoa(iv_text.toString())}`);
  } catch (error) {
    console.error('Password encryption failed!');
    return '';
  }
}

export function decryptForServer(text: string): string {
  try {
    if (text !== null && text !== '') {
      const array_binary = atob(text.toString()).split(',');
      const encrypted_data = atob(array_binary[0]);
      const iv = CryptoJS.enc.Utf8.parse(atob(array_binary[1]));
      const options = { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
      const decrypted = CryptoJS.AES.decrypt(encrypted_data, secret_passphrase, options);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } else {
      return '';
    }
  } catch (error) {
    console.error('Password decryption failed!');
    return '';
  }
}

function getRandomData(): String {
  let data: String = '';
  for (let i = 0; i < 16; i++) {
    data += Math.floor(Math.random() * 10).toString();
  }
  return data;
}

export function decrypt(text: String): String {
  try {
    if (text !== null && text !== '') {
      const array_binary = atob(text.toString()).split(',');
      const salt = CryptoJS.enc.Hex.parse(array_binary[0]);
      const iv = CryptoJS.enc.Hex.parse(array_binary[1]);
      const encrypted_data = CryptoJS.enc.Base64.parse(array_binary[2]);

      const key128Bits500Iterations = CryptoJS.PBKDF2(secret_passphrase, salt, { keySize: 128 / 8, iterations: 500 });
      const options = { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted_data }, key128Bits500Iterations, options);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } else {
      return '';
    }
  } catch (error) {
    console.error('Password decryption failed!');
    return '';
  }
}
