import * as type from './types';
// 同步操作放这里
export default {
  [type.SET_MAC](state, mac) {
    state.mac = mac;
    return true;
  },
  [type.SET_DEVICE_INFO](state, deviceInfo) {
    state.deviceInfo = deviceInfo;
    return true;
  },
  [type.SET_REPAIR](state, hasReportedForRepair) {
    state.hasReportedForRepair = hasReportedForRepair;
    return true;
  },
  [type.SET_DATA_OBJECT](state, obj) {
    const map = {};
    Object.keys(obj).forEach(key => {
      map[key] = Number(obj[key]);
    });
    state.dataObject = { ...state.dataObject, ...map };
    return true;
  },
  [type.SET_CHECK_OBJECT](state, obj) {
    state.checkObject = { ...state.checkObject, ...obj };
    return true;
  },
  [type.SET_STATE](state, [key, value]) {
    state[key] = value;
    return true;
  },
  [type.SET_CHART_DATA](state, obj) {
    state.chartData = { ...state.chartData, ...obj };
    return true;
  },
};
