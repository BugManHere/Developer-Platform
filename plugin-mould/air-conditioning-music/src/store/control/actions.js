import { types, defineTypes } from '@/store/types';

import { sendDataToDevice, getInfo, updateStates, finishLoad, setMqttStatusCallback, getAuthResult } from '@PluginInterface'; // 主体接口
import { getQueryStringByName, isMqtt } from '@/utils/index';

let _timer = null; // 轮询定时器
let _timer2 = null; // 延时发送指令定时器
let _timer3 = null; // 重启轮询定时器
let _firstCallback = true; // 是否第一次查询设备状态
let setData = {};
let hasMqtt = isMqtt();

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
  if (state.dataObject.functype || !state.ableSend) return;
  setData = { ...setData, ...dataMap };
  _timer2 && clearTimeout(_timer2);
  _timer2 = setTimeout(async () => {
    commit(types.CONTROL_SET_STATE, { ableSend: false }, { root: true });
    const setOpt = [];
    const setP = [];
    Object.keys(setData).forEach(key => {
      setOpt.push(key);
      setP.push(Number(setData[key]));
    });
    setData = {};
    if (!setOpt.length) return;
    const mac = state.mac;
    const t = 'cmd';
    const opt = setOpt;
    const p = setP;

    console.table([opt, p]);
    console.log([opt, p]);

    const json = JSON.stringify({ mac, t, opt, p });

    try {
      const _p = JSON.parse(state.devOptions.statueJson).map(json => state.dataObject[json] || 0);
      // 成功之后更新主体状态
      updateStates(state.mac, JSON.stringify(_p));
    } catch (err) {
      err;
    }

    await sendDataToDevice(mac, json, false);
    // 3秒后重启轮询
    if (_timer) {
      dispatch(types.SET_POLLING, false, { root: true });
      clearTimeout(_timer3);
      _timer3 = setTimeout(() => {
        dispatch(types.SET_POLLING, true, { root: true });
      }, 3000);
    }
  }, 350);
}

export default {
  /**
   * @description 初始化，并将小卡片传进来的值赋予 state
   */
  async [defineTypes.CONTROL_INIT]({ dispatch, state }) {
    try {
      // 初始化设备数据
      dispatch(types.INIT_DEVICE_DATA, null, { root: true });
      // 获取授权信息
      dispatch(types.GET_AUTH_TYPE, null, { root: true });
      // 获取设备信息
      dispatch(types.GET_DEVICE_INFO, null, { root: true });
      // 查询一包数据
      hasMqtt || dispatch(types.GET_DEVICE_DATA, null, { root: true });
      // 定时轮询 - 获取设备所有状态数据
      dispatch(types.SET_POLLING, true, { root: true });
      // 初始化 原生调用插件的mqtt回调方法
      hasMqtt &&
        setMqttStatusCallback(state.mac, data => {
          dispatch(types.MQTT_CALLBACK, data, { root: true });
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
  async [defineTypes.INIT_DEVICE_DATA]({ dispatch, commit }) {
    try {
      // 获取mac
      const mac = getQueryStringByName('mac');
      console.log('[url] mac:', mac);
      commit(types.SET_MAC, mac, { root: true });

      // 获取小卡片提供第一包设备数据
      const data = getQueryStringByName('data');
      console.log('[url] data:', data);
      // 根据设备信息解析第一包设备数据
      let dataObject = await dispatch(types.PARSE_DATA_BY_COLS, data, { root: true });

      // 获取functype
      const functype = getQueryStringByName('functype') || 0;
      console.log('[url] functype:', functype);
      dataObject.functype = Number(functype);

      // 自定义数据，根据业务更改
      dataObject = customizeDataObject(dataObject);
      // 更新本地数据
      dispatch(types.UPDATE_DATAOBJECT, dataObject, { root: true });
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * @description 解析设备数据
   * @param {String} data
   */
  [defineTypes.PARSE_DATA_BY_COLS](context, payload) {
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
   * @description 获取设备信息
   */
  [defineTypes.GET_DEVICE_INFO]({ commit, state }) {
    try {
      const { mac } = state;
      console.log('------------GET_DEVICE_INFO');
      console.log(mac);
      getInfo(mac)
        .then(res => {
          const deviceInfo = JSON.parse(res);
          commit(types.SET_DEVICE_INFO, deviceInfo, { root: true });
        })
        .catch(e => console.error(e));
    } catch (e) {
      console.error(e);
    }
  },
  /**
   * @description 获取设备全部状态,插件初始化时立刻查询一次，成功加载数据后finishLoad，然后5秒一次轮询
   */
  async [defineTypes.GET_DEVICE_DATA]({ state, dispatch }) {
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

      let dataObject = await dispatch(types.PARSE_DATA_BY_COLS, data, { root: true });
      // 自定义数据，根据业务更改
      dataObject = customizeDataObject(dataObject);
      // 更新本地数据
      dispatch(types.UPDATE_DATAOBJECT, dataObject, { root: true });
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * @description 开启/关闭轮询
   */
  async [defineTypes.SET_POLLING]({ dispatch }, boolean) {
    clearTimeout(_timer3);
    if (boolean) {
      if (!_timer) {
        _timer = setInterval(() => {
          hasMqtt || dispatch(types.GET_DEVICE_DATA, null, { root: true });
          hasMqtt || dispatch(types.GET_DEVICE_INFO, null, { root: true });
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
  async [defineTypes.SEND_CTRL]({ state, commit, dispatch }, DataObject) {
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
        commit(types.SET_CHECK_OBJECT, { [key]: val }, { root: true });
        dataMap[key] = val;
      }
    });
    if (p.length === 0) {
      _timer2 || commit(types.CONTROL_SET_STATE, { ableSend: false }, { root: true });
    } else {
      sendControl({ state, commit, dispatch }, dataMap);
    }
  },

  /**
   * @description 更新本地数据
   */
  [defineTypes.UPDATE_DATAOBJECT]({ commit, state }, dataObject) {
    if (!state.dataObject.functype && !state.ableSend && dataObject) {
      commit(types.SET_DATA_OBJECT, dataObject, { root: true });
      commit(types.SET_CHECK_OBJECT, dataObject, { root: true });
    }
  },

  /**
   * @description 原生调用插件的mqtt回调方法
   * @param { {data: Object, status: Boolean} } payload data: 设备数据  status: mqtt连接是否可用
   */
  [defineTypes.MQTT_CALLBACK]({ state, dispatch, commit }, payload) {
    let dataObject = {};
    try {
      const res = JSON.parse(payload);
      const { data, deviceState } = res;

      console.log('[mqtt] result:', JSON.stringify(res));
      // 自定义数据，根据业务更改
      dataObject = customizeDataObject(data);
      // 更新本地数据
      dataObject && dispatch(types.UPDATE_DATAOBJECT, dataObject, { root: true });
      deviceState === undefined || commit(types.SET_DEVICE_INFO, { ...state.deviceInfo, deviceState }, { root: true });
    } catch (e) {
      console.error(e);
    }
    return dataObject;
  },
  [defineTypes.GET_AUTH_TYPE]({ state, commit }) {
    getAuthResult(state.mac).then(res => {
      const authReasult = Number(res);
      const commitData = {};
      authReasult === 2 && (commitData.imshowType = 1);
      commitData.authReasult = authReasult;
      if (state.musicData.authDialog === 2) {
        commitData.authDialog = Number(authReasult !== 2);
      }
      commit(types.SET_MUSIC_DATA, commitData, { root: true });
    });
  }
};
