import { types, defineTypes } from './types';
const dev = process.env.NODE_ENV === 'development';

const { cacheDataMap } = require('./userdef');

export default {
  // 处理状态机初始化数据
  [defineTypes.STATE_MACHINE_INITDATA]({ commit }, { data }) {
    // 只有在development才使用初始化数据，虚拟体验需要注释return
    if (!dev) return;
    commit(types.SET_DATA_OBJECT, data);
    commit(types.SET_CHECK_OBJECT, data);
  },
  // 处理状态机接口数据
  [defineTypes.STATE_MACHINE_INTERFACE]({ dispatch, getters }, { data, identifier, from, to }) {
    // 获取需要缓存的数据
    const cacheData = getCache(getters.inputMap, identifier, `${identifier}_${from}`, `${identifier}_${to}`);
    // 更新并发送
    dispatch(types.SEND_DATA, { ...data, ...cacheData });
  },
  // 发送数据接口
  [defineTypes.SEND_DATA](context, data) {
    const { commit, dispatch } = context;
    const sendData = dataHandle(context, data);
    // 更新并发送
    commit(types.SET_DATA_OBJECT, sendData);
    commit(types.CONTROL_SET_STATE, { ableSend: true });
    dispatch(types.SEND_CTRL, sendData);
  },
  // 处理状态机设备名变更
  [defineTypes.UPDATE_DEVICENAME]({ commit, state }, { data }) {
    // 只有在development才使用状态机设备名
    if (!dev) return;
    const deviceInfo = state.control.deviceInfo;
    commit(types.SET_DEVICE_INFO, { ...deviceInfo, name: data.deviceName });
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
  if (!cacheDataArr || !cacheDataArr.length) return {};
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

// 自定义处理数据逻辑
function dataHandle({ state, getters }, data) {
  // 温度处理逻辑
  const temSetJson = getters.temSetJson;
  if (temSetJson in data) {
    // 温度间隔
    const temStep = getters.temStep;
    // 温度值
    const temValue = data[temSetJson];
    // 温度整数
    const temInt = Math.floor(temValue);
    // 温度小数
    const temDeci = (temValue % 1) * 10;
    if (temStep === 0.5) {
      // 处理0.5度逻辑
      const temJson05 = state.jsonArr.tem05;
      data[temJson05] = Number(temDeci >= 5);
    } else if (temStep === 0.1) {
      // 处理0.1度逻辑
      const temJson05 = state.jsonArr.tem05;
      const temJson01 = state.jsonArr.tem01;
      data[temJson05] = Number(temDeci >= 5);
      data[temJson01] = Number(temDeci);
    }
    // 发送整数
    data[temSetJson] = temInt;
  }
  return data;
}
