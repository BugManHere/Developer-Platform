import {
  sendDataToDevice,
  getInfo,
  updateStates,
  finishLoad
} from '@PluginInterface'; // 主体接口
import {
  GET_DEVICE_INFO,
  GET_ALL_STATES,
  SET_DEVICE_INFO,
  SET_DATA_OBJECT,
  SET_CHECK_OBJECT,
  SET_STATE,
  SEND_CTRL
} from './types';


let _timer = 0; // 轮询定时器
let _timer2 = null;
let setData = {};
let lastObject = {};
let sendTime = 0;
const jsonArr = JSON.parse(process.env.VUE_APP_JSON);
/**
 * @description 封装发送指令代码
 */
function sendControl({ state, commit }, dataMap) {
  _timer2 && clearTimeout(_timer2);
  !state.uilock && commit(SET_STATE, ['uilock', true]); // ui锁
  (sendTime += 1) >= 500 && commit(SET_STATE, ['watchLock', true]); // 互斥锁
  setData = {...setData, ...dataMap};
  _timer2 = setTimeout(async () => {
    if (state.swiperHold) {
      sendControl({ state, commit }, {});
      return;
    }
    commit(SET_STATE, ['watchLock', true]);
    commit(SET_STATE, ['ableSend', false]);
    sendTime = 0;
    const setOpt = [];
    const setP = [];
    Object.keys(setData).forEach(key => {
      if (setData[key] !== lastObject[key] && jsonArr.includes(key)) {
        setOpt.push(key);
        setP.push(setData[key]);
      }
    });
    setData = {};
    if (!setOpt.length) return;
    const mac = state.mac;
    const t = 'cmd';
    const opt = setOpt;
    const p = setP;
    const json = JSON.stringify({ mac, t, opt, p });
    console.table([opt, p]);
    console.log([opt, p]);
    const res = await sendDataToDevice(mac, json, false)
      .then(res => {
        // 发送指令后暂停接收，过8秒后重启轮询
        clearInterval(_timer);
        _timer = 0;
        setTimeout(() => {
          if (!_timer) {
            _timer = setInterval(() => {
              getDeviceInfo({state, commit});
              getStatusOfDev({state, commit});
            }, 5000);
          }
        }, 3000);
        return res;
      })
      .catch(err => err);
    lastObject = state.checkObject;
    try {
      const result = JSON.parse(res);
      const { r } = result;
      // const _p = result.p;
      const _p = [state.dataObject.Pow, state.dataObject.Mod,
        state.dataObject.TemUn, state.dataObject.SetTem,
        state.dataObject['Add0.5'], state.dataObject['Add0.1'],
        state.dataObject.PctCle];
      // 成功之后更新主体状态
      r === 200 && commit(SET_STATE, ['uilock', false]) &&
        (await updateStates(state.mac, JSON.stringify(_p))
          .then(res => res)
          .catch(err => err));
    } catch (err) {
      commit(SET_STATE, ['uilock', false]);
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
function getStatusOfDev({ state, commit }) {
  const { cols } = JSON.parse(state.deviceInfo.fullstatueJson);
  return sendDataToDevice(state.mac, state.deviceInfo.fullstatueJson, false)
    .then(_res => {
      const DataObject = {};
      const res = JSON.parse(_res);
      for (let i = 0, j = cols.length; i < j; i += 1) {
        DataObject[cols[i]] = res[i]; // 遍历查询到的数据，将值写入state中的DataObject，根据业务更改
      }
      if (!state.dataObject.functype && !state.uilock) {
        // 非场景时提交数据
        commit(SET_CHECK_OBJECT, DataObject);
        commit(SET_DATA_OBJECT, DataObject);
      }
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
      await dispatch(GET_ALL_STATES);
    }
  },
  /**
   * @description 获取设备全部状态,插件初始化时立刻查询一次，成功加载数据后finishLoad，然后5秒一次轮询
   */
  async [GET_ALL_STATES]({ state, commit }) {
    await getStatusOfDev({ state, commit }).then(res => res);
    finishLoad();
    if (_timer === 0) {
      _timer = setInterval(() => {
        getDeviceInfo({ state, commit });
        getStatusOfDev({ state, commit });
      }, 5000);
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
      // 组装指令，根据业务更改
      if (DataObject[key] !== state.checkObject[key]) {
        opt.push(key);
        p.push(DataObject[key]);
        commit(SET_CHECK_OBJECT, JSON.parse(`{"${key}":${DataObject[key]}}`));
        dataMap[key] = DataObject[key];
      }
    });
    if (!state.dataObject.functype && state.ableSend && p.length !== 0) {
      sendControl({ state, commit }, dataMap);
    } else {
      commit(SET_STATE, ['watchLock', true]);
    }
  }
};
