import { sendDataToDevice, getInfo, updateStates, finishLoad, setMqttStatusCallback } from '@PluginInterface'; // 主体接口
import * as types from './types';

import { getQueryStringByName, isMqtt } from '../utils/index';

let _timer = null; // 轮询定时器
let _timer2 = null; // 延时发送指令定时器
let _timer3 = null; // 重启轮询定时器
let _firstCallback = true; // 是否第一次查询设备状态
let setData = {};
let sendTime = 0;

const { key } = require('@/../plugin.id.json');
const { moreOption } = require(`@/../../../output/${key}.json`);
const statueJson2 = moreOption.statueJson2;

// 自定义数据，根据业务更改
function customizeDataObject(_dataObject) {
  const dataObject = _dataObject;
  return dataObject;
}

// 封装发送指令代码
function sendControl({ state, commit, dispatch }, dataMap) {
  _timer2 && clearTimeout(_timer2) && (_timer2 = null);
  (sendTime += 1) >= 500 && commit(types.SET_STATE, { watchLock: true }); // 互斥锁
  setData = { ...setData, ...dataMap };
  _timer2 = setTimeout(async () => {
    commit(types.SET_STATE, { watchLock: true }); // 关闭互斥
    sendTime = 0;
    const setOpt = [];
    const setP = [];
    Object.keys(setData).forEach(key => {
      if (statueJson2.includes(key)) {
        setOpt.push(key);
        setP.push(Number(setData[key]));
      }
    });
    setData = {};
    if (!setOpt.length || state.dataObject.functype || !state.ableSend) {
      commit(types.SET_STATE, { ableSend: false });
      return;
    }
    const mac = state.mac;
    const t = 'cmd';
    const opt = setOpt;
    const p = setP;

    console.table([opt, p]);
    console.log([opt, p]);

    const json = JSON.stringify({ mac, t, opt, p });
    const res = await sendDataToDevice(mac, json, false);
    commit(types.SET_STATE, { ableSend: false });

    // 3秒后重启轮询
    if (_timer) {
      dispatch(types.SET_POLLING, false);
      clearTimeout(_timer3);
      _timer3 = setTimeout(() => {
        dispatch(types.SET_POLLING, true);
      }, 3000);
    }

    try {
      const result = JSON.parse(res);
      const { r } = result;
      const _p = JSON.parse(state.devOptions.statueJson).map(json => state.dataObject[json] || 0);
      // 成功之后更新主体状态
      r === 200 && updateStates(state.mac, JSON.stringify(_p));
    } catch (err) {
      err;
    }
  }, 350);
}

export default {
  /**
   * @description 初始化，并将小卡片传进来的值赋予 state
   */
  async [types.INIT]({ dispatch, state }) {
    try {
      // 初始化设备数据
      await dispatch(types.INIT_DEVICE_DATA);
      // 获取设备信息
      dispatch(types.GET_DEVICE_INFO);
      // 查询一包数据
      dispatch(types.GET_DEVICE_DATA);
      // 定时轮询 - 获取设备所有状态数据
      dispatch(types.SET_POLLING, true);
      // 初始化 原生调用插件的mqtt回调方法
      isMqtt();
      setMqttStatusCallback(state.mac, data => {
        dispatch(types.MQTT_CALLBACK, data);
      });
    } catch (e) {
      console.warn(e);
    } finally {
      // 关闭原生加载H5的全屏白底loading
      // TODO: vue 可能没渲染完页面
      finishLoad();
    }
  },

  /**
   * @description 初始化设备数据
   */
  async [types.INIT_DEVICE_DATA]({ dispatch, commit }) {
    try {
      // 获取mac
      const mac = getQueryStringByName('mac');
      console.log('[url] mac:', mac);
      commit(types.SET_MAC, mac);

      // 获取小卡片提供第一包设备数据
      const data = getQueryStringByName('data');
      console.log('[url] data:', data);
      // 根据设备信息解析第一包设备数据
      let dataObject = await dispatch(types.PARSE_DATA_BY_COLS, data);

      // 获取functype
      const functype = getQueryStringByName('functype') || 0;
      console.log('[url] functype:', functype);
      dataObject.functype = Number(functype);

      // 自定义数据，根据业务更改
      dataObject = customizeDataObject(dataObject);
      // 更新本地数据
      dispatch(types.UPDATE_DATAOBJECT, dataObject);
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * @description 解析设备数据
   * @param {String} data
   */
  [types.PARSE_DATA_BY_COLS](context, payload) {
    const dataObject = {};
    if (!payload) return dataObject;
    try {
      const cols = statueJson2;
      const res = JSON.parse(payload);
      // 遍历查询到的数据
      cols.forEach((json, index) => {
        dataObject[json] = res[index];
      });
      console.log('dataObject:', JSON.stringify(dataObject));
    } catch (e) {
      console.error(e);
    }
    return dataObject;
  },

  /**
   * @description 获取设备信息，并开始轮询设备状态
   */
  async [types.GET_DEVICE_INFO]({ commit, state }) {
    try {
      const { mac } = state;
      const res = await getInfo(mac).catch(e => console.error(e));
      const deviceInfo = JSON.parse(res);
      commit(types.SET_DEVICE_INFO, deviceInfo);
    } catch (e) {
      console.error(e);
    }
  },
  /**
   * @description 获取设备全部状态,插件初始化时立刻查询一次，成功加载数据后finishLoad，然后5秒一次轮询
   */
  async [types.GET_DEVICE_DATA]({ state, dispatch }) {
    // dispatch(types.SET_POLLING, true);
    try {
      // 集中控制时数据不查询
      if (state.functype) return;

      const { mac } = state;

      // 采用本地 SEARCH_JSON 作查询， fullstatueJson 弃用，为了更快显示H5
      const cols = statueJson2;
      const t = 'status';
      const SEARCH_JSON = JSON.stringify({ cols, mac, t });

      const data = await sendDataToDevice(mac, SEARCH_JSON, false);

      // 尝试修复设备断电后，立刻点击小卡片，显示WebView控制页面的整改问题
      if (_firstCallback && data === '') {
        showToast('网络异常', 1);
        closePage();
      }
      _firstCallback = false;

      let dataObject = await dispatch(types.PARSE_DATA_BY_COLS, data);
      // 自定义数据，根据业务更改
      dataObject = customizeDataObject(dataObject);
      // 更新本地数据
      dispatch(types.UPDATE_DATAOBJECT, dataObject);
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * @description 开启/关闭轮询
   */
  async [types.SET_POLLING]({ dispatch }, boolean) {
    clearTimeout(_timer3);
    if (boolean) {
      if (!_timer) {
        _timer = setInterval(() => {
          dispatch(types.GET_DEVICE_DATA);
          dispatch(types.GET_DEVICE_INFO);
        }, 5000);
      }
    } else {
      clearInterval(_timer);
      _timer = null;
    }
  },

  /**
   * @description 发送控制指令
   */
  async [types.SEND_CTRL]({ state, commit, dispatch }, DataObject) {
    const keys = Object.keys(DataObject);
    const opt = [];
    const p = [];
    const dataMap = {};
    keys.forEach(key => {
      // 组装指令，根据业务更改，温度值需要整套发送
      if (DataObject[key] !== state.checkObject[key] || ['SetTem', 'Add0.1', 'Add0.5'].includes(key)) {
        const val = DataObject[key] || 0;
        opt.push(key);
        p.push(val);
        commit(types.SET_CHECK_OBJECT, { [key]: val });
        dataMap[key] = val;
      }
    });
    if (p.length === 0) {
      _timer2 || commit(types.SET_STATE, { watchLock: true, ableSend: false });
    } else {
      sendControl({ state, commit, dispatch }, dataMap);
    }
  },

  /**
   * @description 更新本地数据
   */
  [types.UPDATE_DATAOBJECT]({ commit, state }, dataObject) {
    if (!state.ableSend && dataObject) {
      commit(types.SET_DATA_OBJECT, dataObject);
      commit(types.SET_CHECK_OBJECT, dataObject);
    }
  },

  /**
   * @description 原生调用插件的mqtt回调方法
   * @param { {data: Object, status: Boolean} } payload data: 设备数据  status: mqtt连接是否可用
   */
  [types.MQTT_CALLBACK]({ dispatch }, payload) {
    let dataObject = {};
    try {
      const res = JSON.parse(payload);
      const { data } = res;

      console.log('[mqtt] dataObject:', JSON.stringify(data));
      // 自定义数据，根据业务更改
      dataObject = customizeDataObject(data);
      // 更新本地数据
      dispatch(types.UPDATE_DATAOBJECT, dataObject);

      /*
       * 现架构，mqtt服需3分钟以上才能判断设备在线离线，故支持mqtt的设备还需保留原有8秒主动查询逻辑，进行离线在线判断
       * 判断 mqtt 是否可用。不可用的情况：服务器有问题  网络有问题（不能联网的局域网）
       * status 为 false 时 启动定时轮询
       * status 为 true  时 清除定时轮询
       */
      // switch (status) {
      //   case false:
      //     // 获取设备信息
      //     dispatch(types.GET_DEVICE_INFO);
      //     // 查询一包数据
      //     dispatch(types.GET_DEVICE_DATA);
      //     // 定时轮询 - 获取设备所有状态数据
      //     dispatch(types.TIMER_GET_ALL_DEVICE_STATES);
      //     break;

      //   case true:
      //     // 清除定时器
      //     timer && clearInterval(timer);
      //     break;

      //   default:
      //     break;
      // }
    } catch (e) {
      console.error(e);
    }
    return dataObject;
  }
};
