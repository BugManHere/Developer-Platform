// 是否正整数
export const isPositiveNum = value => {
  return value >>> 0 === value;
};

// 数组、对象深复制
export const deepCopy = function(obj) {
  if (obj === null) return null;
  if (obj.constructor !== 'object') return obj;
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);
  var newObj = new obj.constructor(); //保持继承的原型
  for (var key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      var val = obj[key];
      newObj[key] = typeof val === 'object' ? arguments.callee(val) : val;
    }
  }
  return newObj;
};

// 生成随机数
export const randomKey = len => {
  return Array.from({ length: len }, () => {
    return Math.floor(Math.random() * 10);
  }).join('');
};
