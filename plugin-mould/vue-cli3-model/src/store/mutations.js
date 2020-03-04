import * as type from './types';
// 同步操作放这里
export default {
  [type.SET_MAC](state, mac) {
    state.mac = mac;
  },
  [type.SET_DEVICE_INFO](state, deviceInfo) {
    state.deviceInfo = deviceInfo;
  },
  [type.SET_REPAIR](state, hasReportedForRepair) {
    state.hasReportedForRepair = hasReportedForRepair;
  },
  [type.SET_DATA_OBJECT](state, obj) {
    state.dataObject = { ...state.dataObject, ...obj };
  },
  [type.SET_CHECK_OBJECT](state, obj) {
    state.checkObject = { ...state.checkObject, ...obj };
  },
  [type.SET_STATE](state, [key, value]) {
    state[key] = value;
  },
};
