/**
 * @description 是否正整数
 */
export const isPositiveNum = value => {
  return value >>> 0 === value;
};

export const deepCopy = map => {
  return JSON.parse(JSON.stringify(map));
}

export const randomKey = len => {
  return Array.from({length: len}, () => {return Math.floor(Math.random() * 10)}).join('');
}