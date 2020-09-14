import { sendDataToDevice, getInfo, updateStates, finishLoad } from '@PluginInterface'; // 主体接口
import {
  GET_DEVICE_INFO,
  GET_ALL_STATES,
  SET_DEVICE_INFO,
  SET_DATA_OBJECT,
  SET_CHECK_OBJECT,
  SET_STATE,
  SEND_CTRL,
  UPDATE_DATAOBJECT,
  SET_POLLING
} from './types';

let _timer = 0; // 轮询定时器
let _timer2 = null; // 延时发送指令定时器
let _timer3 = null; // 重启轮询定时器
let setData = {};
let sendTime = 0;

/**
 * @description 封装发送指令代码
 */
function sendControl({ state, commit, dispatch }, dataMap) {
  _timer2 && clearTimeout(_timer2) && (_timer2 = null);
  (sendTime += 1) >= 500 && commit(SET_STATE, { watchLock: true }); // 互斥锁
  setData = { ...setData, ...dataMap };
  _timer2 = setTimeout(async () => {
    commit(SET_STATE, { watchLock: true }); // 关闭互斥
    sendTime = 0;
    const setOpt = [];
    const setP = [];
    Object.keys(setData).forEach(key => {
      if (state.devOptions.statueJson2.includes(key)) {
        setOpt.push(key);
        setP.push(Number(setData[key]));
      }
    });
    setData = {};
    if (!setOpt.length || state.dataObject.functype || !state.ableSend) {
      commit(SET_STATE, { ableSend: false });
      return;
    }
    const mac = state.mac;
    const t = 'cmd';
    const opt = setOpt;
    const p = setP;

    console.table([opt, p]);
    const json = JSON.stringify({ mac, t, opt, p });
    const res = await sendDataToDevice(mac, json, false);
    commit(SET_STATE, { ableSend: false });

    // 3秒后重启轮询
    if (_timer) {
      dispatch(SET_POLLING, false);
      clearTimeout(_timer3);
      _timer3 = setTimeout(() => {
        dispatch(SET_POLLING, true);
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

/**
 * @description 获取设备在线状态
 */
function getDeviceInfo({ state, commit }) {
  return getInfo(state.mac)
    .then(res => {
      const deviceInfo = JSON.parse(res);

      commit(SET_DEVICE_INFO, deviceInfo);
      return res;
    })
    .catch(err => {
      err;
    });
}

/**
 * @description 返回一个向整机查询数据的promise，这个promise执行成功后返回查到的数据DataObject
 */
function getStatusOfDev({ state, commit, dispatch }) {
  const fullstatueJson = JSON.parse(state.deviceInfo.fullstatueJson);
  fullstatueJson.cols = JSON.parse(state.devOptions.statueJson2);
  return sendDataToDevice(state.mac, JSON.stringify(fullstatueJson), false)
    .then(_res => {
      const DataObject = {};
      const res = JSON.parse(_res);
      fullstatueJson.cols.forEach((json, index) => {
        DataObject[json] = res[index];
      });
      // 非场景时提交数据，且不是在发命令的时候
      if (state.dataObject.functype) {
        dispatch(SET_POLLING, false);
      } else if (!state.ableSend) {
        commit(SET_CHECK_OBJECT, DataObject);
        commit(SET_DATA_OBJECT, DataObject);
      }
      console.log('--------------DataObject-------------');
      console.log(DataObject);
      return DataObject;
    })
    .catch(err => {
      return err;
    });
}
/**
 * @returns Promise，等待计时结束进行下一项任务
 */
function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export default {
  /**
   * @description 获取设备信息，并开始轮询设备状态
   */
  async [GET_DEVICE_INFO]({ dispatch, commit, state }) {
    const _res = await getInfo(state.mac)
      .then(res => {
        return res;
      })
      .catch(err => {
        err;
      });
    // 防止Android端第一次下载插件fullstatueJson为空值
    if (JSON.parse(_res).fullstatueJson === '') {
      await sleep(1000);
      dispatch(GET_DEVICE_INFO);
    } else {
      const deviceInfo = JSON.parse(_res);
      commit(SET_DEVICE_INFO, deviceInfo);
      dispatch(GET_ALL_STATES);
    }
  },
  /**
   * @description 获取设备全部状态,插件初始化时立刻查询一次，成功加载数据后finishLoad，然后5秒一次轮询
   */
  async [GET_ALL_STATES]({ state, commit, dispatch }) {
    await getStatusOfDev({ state, commit });
    finishLoad();
    dispatch(SET_POLLING, true);
  },

  /**
   * @description 开启/关闭轮询
   */
  async [SET_POLLING]({ state, commit }, boolean) {
    clearTimeout(_timer3);
    if (boolean) {
      if (_timer === 0) {
        _timer = setInterval(() => {
          getDeviceInfo({ state, commit });
          getStatusOfDev({ state, commit });
        }, 5000);
      }
    } else {
      clearInterval(_timer);
      _timer = 0;
    }
  },

  /**
   * @description 发送控制指令
   */
  async [SEND_CTRL]({ state, commit }, DataObject) {
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
        commit(SET_CHECK_OBJECT, { [key]: val });
        dataMap[key] = val;
      }
    });
    if (p.length === 0) {
      _timer2 || commit(SET_STATE, { watchLock: true, ableSend: false });
    } else {
      sendControl({ state, commit }, dataMap);
    }
  },

  /**
   * @description 更新本地数据
   */
  [UPDATE_DATAOBJECT]({ commit }, DataObject) {
    commit(SET_DATA_OBJECT, DataObject);
    commit(SET_CHECK_OBJECT, DataObject);
  }
};
