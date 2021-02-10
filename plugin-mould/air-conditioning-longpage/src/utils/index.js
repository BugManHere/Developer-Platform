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

const UA = navigator.userAgent;

/**
 * 判读模块是否 MQTT 协议
 */
export const isMqtt = () => {
  let reg = /upper_device_protocol_version\/V*(\d*)/; // 匹配固件版本
  let ver = UA.match(reg);
  if (!ver) return 0;

  let version = ver[1]; // 模块传的值 "V3.0+"
  if (Number(version) < 3) return 0;

  reg = /mqttfunction\/V*(\d*)/; // 匹配影子设备版本
  ver = UA.match(reg);
  // 至少为一期
  if (!ver) return 1;
  return Number(ver[1]) || 1;
};
