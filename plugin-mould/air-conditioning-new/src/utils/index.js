/**
 * @description 获取数组元素的index
 * @param {array} arrList 输入元素所在数组
 * @param {String} itemId 需要匹配的属性
 * @param {number} myIndex 实际获取的值
 * @returns realIndex, 查找数组元素的itemId属性，与myIndex相同时返回该数组元素的index
 */
export const getRealIndex = (arrList, itemId, myIndex) => {
  let realIndex = 0;
  arrList.forEach(element => {
    const Item = element;
    if (Item[itemId] === myIndex) {
      realIndex = arrList.indexOf(Item);
    }
  });
  return realIndex;
};

/**
 * @description 解析url参数
 * @function getQueryStringByName
 * @version 0.0.1
 * @param {string} text 传入的url参数
 */
export const getQueryStringByName = text => {
  const href = decodeURI(location.href); // 转义
  const result = href.match(new RegExp(`[?&]${text}=([^&#]+)`, 'i'));
  if (result == null || result.length < 1) {
    return '';
  }
  return result[1];
};

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    const context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, ...args);
    }, delay);
  };
};

export const throttle = (fn, interval) => {
  let last = 0;
  return (...args) => {
    const context = this;
    const now = Date.now();

    if (now - last > interval) {
      last = now;
      fn.apply(context, ...args);
    }
  };
};

const u = navigator.userAgent;
export const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
export const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
