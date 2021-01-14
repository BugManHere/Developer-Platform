import { sendDataToDevice, getInfo, updateStates, setMqttStatusCallback, showToast, closePage, finishLoad, getCloudTimerByMac } from '@PluginInterface'; // 主体接口
import * as types from './types';

import { getQueryStringByName, isMqtt } from '../utils/index';

let _timer = 0; // 轮询定时器
let _timer2 = null;
let _timer3 = null; // 重启轮询定时器
let _firstCallback = true; // 是否第一次查询设备状态
let setData = {};
let mqttVer = isMqtt();
const { key } = require('@/../plugin.id.json');

const { moreOption } = require(`@/../../../output/${key}.json`);
const statueJson2 = moreOption.statueJson2;

// 自定义数据，根据业务更改
function customizeDataObject({ state }, _dataObject) {
  const dataObject = _dataObject || {};
  // 兼容辅热，如果开启了八度制热，则不更新辅热
  if ('AssHt' in dataObject && state.devOptions.identifierArr.includes('AssHt(Auto)') && dataObject.StHt) {
    dataObject.AssHt = 1;
  }
  // 云定时
  if ('AppTimer' in dataObject) {
    dataObject.AppTimer = Number(dataObject.AppTimer || state.cloudTimer);
  }
  // 外出模式
  if ('OutHome' in dataObject && dataObject.functype) {
    dataObject.OutHome = 0;
  }
  return dataObject;
}

/**
 * @description 封装发送指令代码
 */
function sendControl({ state, commit, dispatch }, dataMap) {
  if (!state.ableSend) return;
  setData = { ...setData, ...dataMap };
  clearTimeout(_timer2);
  _timer2 = setTimeout(async () => {
    commit(types.SET_STATE, ['watchLock', true]); // 互斥锁
    if (state.swiperHold) {
      sendControl({ state, commit, dispatch }, {});
      return;
    }
    const setOpt = [];
    const setP = [];
    Object.keys(setData).forEach(key => {
      // 温度命令需要一组一起发送
      setOpt.push(key);
      setP.push(Number(setData[key]));
    });
    setData = {};
    if (!setOpt.length) {
      commit(types.SET_STATE, ['watchLock', true]); // 互斥锁
      commit(types.SET_STATE, ['ableSend', false]);
      return;
    }
    const mac = state.mac;
    const t = 'cmd';
    const opt = setOpt;
    const p = setP;

    // 8度制热相关操作
    state.isStHt && commit(types.SET_STATE, ['isStHt', false]); // 关闭8度制热标志位
    if (state.devOptions.identifierArr.includes('AssHt(Auto)') && opt.includes('StHt') && !opt.includes('AssHt')) {
      setOpt.push('AssHt');
      setP.push(1);
    } else if (!setOpt.includes('StHt')) {
      setOpt.push('StHt');
      setP.push(0);
    }

    const json = JSON.stringify({ mac, t, opt, p });

    if (state.dataObject.functype) return;

    try {
      const _p = JSON.parse(state.devOptions.statueJson).map(json => state.dataObject[json] || 0);
      // 成功之后更新主体状态
      updateStates(state.mac, JSON.stringify(_p));
    } catch (err) {
      err;
    }

    // 1秒后重启轮询
    dispatch(types.SET_POLLING, false);
    clearTimeout(_timer3);
    _timer3 = setTimeout(() => {
      commit(types.SET_STATE, ['ableSend', false]);
      dispatch(types.SET_POLLING, true);
    }, 1000);

    console.table([opt, p]);
    console.log([opt, p]);

    sendDataToDevice(mac, json, false);
  }, 350);
}

// 查询云定时
function getCloudTimer({ state, commit }) {
  getCloudTimerByMac(state.mac).then(res => {
    const { timerTasks } = JSON.parse(res);
    let result = false;
    if (timerTasks.length) {
      result = timerTasks.some(task => {
        return task.timer.status;
      });
    }
    commit(types.SET_STATE, ['cloudTimer', result]);
  });
}

export default {
  /**
   * @description 初始化，并将小卡片传进来的值赋予 state
   */
  async [types.INIT]({ dispatch, state }) {
    try {
      // 初始化设备数据
      dispatch(types.INIT_DEVICE_DATA);
      // 获取设备信息
      dispatch(types.GET_DEVICE_INFO);
      // 查询云定时
      dispatch(types.GET_CLOUD_TIMER);
      // 查询一包数据
      mqttVer <= 1 && dispatch(types.GET_DEVICE_DATA);
      // 定时轮询 - 获取设备所有状态数据
      dispatch(types.SET_POLLING, true);
      // 初始化 原生调用插件的mqtt回调方法
      mqttVer &&
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
  async [types.INIT_DEVICE_DATA]({ dispatch, commit, state }) {
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

      // 设备状态页
      const FreshAirConditionState = getQueryStringByName('FreshAirConditionState') || 0;
      dataObject.FreshAirConditionState = Number(FreshAirConditionState);

      // 自定义数据，根据业务更改
      dataObject = customizeDataObject({ state }, dataObject);
      // 更新本地数据
      dispatch(types.UPDATE_DATAOBJECT, dataObject);
      console.log('------------INIT_DEVICE_DATA----------');
      console.log(dataObject);
      commit(types.SET_STATE, ['loading', false]);
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
    } catch (e) {
      console.error(e);
    }
    return dataObject;
  },

  /**
   * @description 获取设备信息
   */
  [types.GET_DEVICE_INFO]({ commit, state }) {
    try {
      const { mac } = state;
      getInfo(mac)
        .then(res => {
          const deviceInfo = JSON.parse(res);
          commit(types.SET_DEVICE_INFO, deviceInfo);
        })
        .catch(e => console.error(e));
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * @description 获取设备全部状态,插件初始化时立刻查询一次，成功加载数据后finishLoad，然后5秒一次轮询
   */
  async [types.GET_DEVICE_DATA]({ state, dispatch, commit }) {
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
      dataObject = customizeDataObject({ state }, dataObject);
      // 更新本地数据
      dispatch(types.UPDATE_DATAOBJECT, dataObject);
      console.log('------------GET_DEVICE_DATA----------');
      console.log(dataObject);
      commit(types.SET_STATE, ['loading', false]);
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * @description 开启/关闭轮询
   */
  async [types.SET_POLLING]({ state, commit, dispatch }, boolean) {
    if (mqttVer > 1) return;
    clearInterval(_timer);
    _timer = null;
    if (boolean) {
      _timer = setInterval(() => {
        getCloudTimer({ state, commit });
        dispatch(types.GET_DEVICE_DATA);
        dispatch(types.GET_DEVICE_INFO);
      }, 5000);
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
      if (DataObject[key] !== state.checkObject[key] || ['SetTem', 'Add0.1', 'Add0.5', 'Emod'].includes(key)) {
        const val = DataObject[key] || 0;
        opt.push(key);
        p.push(val);
        commit(types.SET_CHECK_OBJECT, { [key]: val });
        dataMap[key] = val;
      }
    });
    // 所有操作都需要关掉8度制热，所以直接在这写好了
    if (!state.isStHt && state.ableSend) {
      dataMap.StHt = 0;
      commit(types.SET_DATA_OBJECT, { StHt: 0 });
      commit(types.SET_CHECK_OBJECT, { StHt: 0 });
    }
    if (p.length) {
      sendControl({ state, commit, dispatch }, dataMap);
    } else {
      !_timer2 && commit(types.SET_STATE, ['ableSend', false]);
    }
  },

  /**
   * @description 更新本地数据
   */
  [types.UPDATE_DATAOBJECT]({ commit, state }, dataObject) {
    if (!state.dataObject.functype && !state.ableSend && dataObject) {
      commit(types.SET_DATA_OBJECT, dataObject);
      commit(types.SET_CHECK_OBJECT, dataObject);
    }
  },

  /**
   * @description 原生调用插件的mqtt回调方法
   * @param { {data: Object, status: Boolean} } payload data: 设备数据  status: mqtt连接是否可用
   */
  [types.MQTT_CALLBACK]({ state, dispatch, commit }, payload) {
    let dataObject = {};
    try {
      const res = JSON.parse(payload);
      console.log('[mqtt] result:', JSON.stringify(res));
      const { data, deviceState } = res;

      // 自定义数据，根据业务更改
      dataObject = customizeDataObject({ state }, data);
      // 更新本地数据
      dataObject && dispatch(types.UPDATE_DATAOBJECT, dataObject);
      deviceState === undefined || commit(types.SET_DEVICE_INFO, { ...state.deviceInfo, deviceState });
    } catch (e) {
      console.error(e);
    }
    return dataObject;
  },

  // 查询云定时
  [types.GET_CLOUD_TIMER]({ state, commit }) {
    getCloudTimer({ state, commit });
  }
};
