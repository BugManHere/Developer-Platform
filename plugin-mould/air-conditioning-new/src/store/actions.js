import * as types from './types';
const dev = process.env.NODE_ENV === 'development';

const { cacheDataMap } = require('./userdef');

export default {
  // 处理状态机初始化数据
  [types.STATE_MACHINE_INITDATA]({ commit }, { data }) {
    // 只有在development才使用初始化数据
    if (!dev) return;
    commit('control/SET_DATA_OBJECT', data);
    commit('control/SET_CHECK_OBJECT', data);
  },
  // 处理状态机接口数据
  [types.STATE_MACHINE_INTERFACE]({ commit, dispatch, getters }, { data, identifier, from, to }) {
    // 获取需要缓存的数据
    const cacheData = getCache(getters.inputMap, identifier, `${identifier}_${from}`, `${identifier}_${to}`);
    // 更新并发送
    commit('control/SET_DATA_OBJECT', { ...data, ...cacheData });
    dispatch('control/SEND_CTRL', { ...data, ...cacheData });
  },
  // 处理状态机设备名变更
  [types.UPDATE_DEVICENAME]({ commit, state }, { data }) {
    // 只有在development才使用状态机设备名
    if (!dev) return;
    const deviceInfo = state.control.deviceInfo;
    commit('control/SET_DEVICE_INFO', { ...deviceInfo, name: data.deviceName });
  }
};

/**
 * @description 获取缓存
 * @param {Object} inputData 用于数据处理的map
 * @param {String} identifier model的唯一标识符
 * @param {String} lastStateName from stateName
 * @param {String} currentStateName to stateName
 * @returns {Object} 从缓存中获取的数据
 */
function getCache(inputData, identifier, lastStateName, currentStateName) {
  // 根据identifier获取需要缓存的json
  const cacheDataArr = cacheDataMap[identifier];
  // 如果没有需要缓存的json,返回
  if (!cacheDataArr || !cacheDataArr.length) return;
  /**
   * @param {String} storageKey 在localstorage中用作存储的key
   * @param {Array} jsons 缓存的json数组
   * @returns {Object} 从缓存中获取的数据
   */
  const getCacheByJson = (storageKey, jsons) => {
    const storage = window.storage;
    // 根据storageKey从storage中获取对应数据
    const data = storage.get(storageKey) || {};
    // 根据当前statusName,从缓存中获取需要发送的数据
    const sendData = data[currentStateName] || {};
    // 定义一个对象,用于存储当前数据在storage中
    const lastData = {};
    // 从inputData中取出需要缓存的数据
    jsons.forEach(json => {
      lastData[json] = inputData[json] || 0;
    });
    // 暂存进data变量
    data[lastStateName] = lastData;
    // 存入storage中
    storage.set(storageKey, data);
    // 返回从缓存中获取的数据
    return sendData;
  };
  // 定义一个对象，收集所有从缓存中获取的数据
  let output = {};
  // 根据定义轮询获取数据
  cacheDataArr.forEach(({ storageKey, jsons }) => {
    output = {
      ...output,
      ...getCacheByJson(storageKey, jsons)
    };
  });
  return output;
}
