// 是否正整数
export const isPositiveNum = value => {
  return value >>> 0 === value;
};

// 数组、对象深复制
export const deepCopy = map => {
  return map ? JSON.parse(JSON.stringify(map)) : '';
};

// 生成随机数
export const randomKey = len => {
  return Array.from({ length: len }, () => {
    return Math.floor(Math.random() * 10);
  }).join('');
};
