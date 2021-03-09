import CryptoJS from 'crypto-js';

/**

* @param {*需要加密的字符串 注：对象转化为json字符串再加密} word

* @param {*aes加密需要的key值，这个key值后端同学会告诉你} keyStr

*/

export function encrypt(word, keyStr) {
  // 加密
  var key = CryptoJS.enc.Utf8.parse(keyStr);

  var srcs = CryptoJS.enc.Utf8.parse(word);

  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }); // 加密模式为ECB，补码方式为PKCS5Padding（也就是PKCS7）

  return encrypted.toString();
}

export function decrypt(word, keyStr) {
  // 解密
  var key = CryptoJS.enc.Utf8.parse(keyStr);

  var decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

export default {
  encrypt,
  decrypt
};
