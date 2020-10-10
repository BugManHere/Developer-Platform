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
  SEND_CTRL,
  UPDATE_DATAOBJECT,
  SET_POLLING
} from './types';

let _timer = 0; // 轮询定时器
let _timer2 = null;
let _timer3 = null; // 重启轮询定时器
let setData = {};
let lastObject = {};
let sendTime = 0;
/**
 * @description 封装发送指令代码
 */
function sendControl({ state, commit, dispatch }, dataMap) {
  _timer2 && clearTimeout(_timer2) && (_timer2 = null);
  (sendTime += 1) >= 500 && commit(SET_STATE, ['watchLock', true]); // 互斥锁
  setData = { ...setData, ...dataMap };
  commit(SET_STATE, ['uilock', true]); // ui锁
  _timer2 = setTimeout(async () => {
    if (state.swiperHold) {
      sendControl({ state, commit }, {});
      return;
    }
    sendTime = 0;
    const setOpt = [];
    const setP = [];
    Object.keys(setData).forEach(key => {
      // 温度命令需要一组一起发送
      if (
        setData[key] !== lastObject[key] ||
        ['SetTem', 'Add0.1', 'Add0.5'].includes(key)
      ) {
        setOpt.push(key);
        setP.push(Number(setData[key]));
      }
    });
    setData = {};
    if (!setOpt.length) return;
    const mac = state.mac;
    const t = 'cmd';
    const opt = setOpt;
    const p = setP;

    console.table([opt, p]);

    // 8度制热相关操作
    state.isStHt && commit(SET_STATE, ['isStHt', false]); // 关闭8度制热标志位
    if (
      state.devOptions.identifierArr.includes('AssHt(Auto)') &&
      opt.includes('StHt') &&
      !opt.includes('AssHt')
    ) {
      setOpt.push('AssHt');
      setP.push(1);
    } else if (!setOpt.includes('StHt')) {
      setOpt.push('StHt');
      setP.push(0);
    }

    const json = JSON.stringify({ mac, t, opt, p });

    if (state.dataObject.functype || !state.ableSend) {
      commit(SET_STATE, ['uilock', false]); // ui锁
      return;
    }
    commit(SET_STATE, ['watchLock', true]);
    commit(SET_STATE, ['ableSend', false]);
    console.log(json);
    const res = await sendDataToDevice(mac, json, false)
      .then(res => {
        // 发送指令后暂停接收，过3秒后重启轮询
        if (_timer) {
          dispatch(SET_POLLING, false);
          clearTimeout(_timer3);
          _timer3 = setTimeout(() => {
            dispatch(SET_POLLING, true);
          }, 3000);
        }
        return res;
      })
      .catch(err => err);
    lastObject = state.checkObject;

    try {
      const result = JSON.parse(res);
      const { r } = result;
      const _p = JSON.parse(state.devOptions.statueJson).map(json =>
        state.dataObject[json] === undefined ? 0 : state.dataObject[json]
      );
      console.log('----------_p');
      console.log(_p);
      // 成功之后更新主体状态
      commit(SET_STATE, ['swiperHold', false]);
      commit(SET_STATE, ['uilock', false]);
      r === 200 && updateStates(state.mac, JSON.stringify(_p));
    } catch (err) {
      commit(SET_STATE, ['swiperHold', false]);
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

      // 兼容辅热，如果开启了八度制热，则不更新辅热
      if (
        state.devOptions.identifierArr.includes('AssHt(Auto)') &&
        DataObject.StHt
      ) {
        DataObject.AssHt = 1;
      }

      if (!state.dataObject.functype && !state.uilock) {
        // 非场景时提交数据
        commit(SET_CHECK_OBJECT, DataObject);
        commit(SET_DATA_OBJECT, DataObject);
        lastObject = state.checkObject;
      } else if (state.dataObject.functype) {
        dispatch(SET_POLLING, false);
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
      await dispatch(GET_ALL_STATES);
    }
  },
  /**
   * @description 获取设备全部状态,插件初始化时立刻查询一次，成功加载数据后finishLoad，然后5秒一次轮询
   */
  async [GET_ALL_STATES]({ state, commit, dispatch }) {
    await getStatusOfDev({ state, commit }).then(res => res);
    finishLoad();
    setTimeout(() => {
      commit(SET_STATE, ['loading', false]);
    }, 1000);
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
    const Json2 = JSON.parse(state.devOptions.statueJson2);
    keys.forEach(key => {
      // 组装指令，根据业务更改，温度值需要整套发送
      if (
        (DataObject[key] !== state.checkObject[key] ||
          ['SetTem', 'Add0.1', 'Add0.5'].includes(key)) &&
        Json2.includes(key)
      ) {
        const val = isNaN(DataObject[key]) ? 0 : DataObject[key];
        opt.push(key);
        p.push(val);
        commit(SET_CHECK_OBJECT, JSON.parse(`{"${key}":${val}}`));
        dataMap[key] = val;
      }
    });
    // 所有操作都需要关掉8度制热，所以直接在这写好了
    if (!state.isStHt && state.ableSend) {
      dataMap.StHt = 0;
      commit(SET_DATA_OBJECT, { StHt: 0 });
      commit(SET_CHECK_OBJECT, { StHt: 0 });
    }
    if (p.length !== 0) {
      sendControl({ state, commit }, dataMap);
    } else {
      !_timer2 && commit(SET_STATE, ['watchLock', true]);
    }
  },

  /**
   * @description 更新本地数据
   */
  [UPDATE_DATAOBJECT]({ state, commit }, DataObject) {
    commit(SET_DATA_OBJECT, DataObject);
    commit(SET_CHECK_OBJECT, DataObject);
    lastObject = state.checkObject;
  }
};
