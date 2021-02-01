import { defineTypes } from '@/store/types';
// 同步操作放这里
export default {
  [defineTypes.SET_MAC](state, { mac, mainMac }) {
    state.mac = mac;
    state.mainMac = mainMac;
  },
  [defineTypes.SET_DEVICE_INFO](state, deviceInfo) {
    state.deviceInfo = deviceInfo;
  },
  [defineTypes.SET_DATA_OBJECT](state, obj) {
    const map = {};
    Object.keys(obj).forEach(key => {
      // if (typeof obj[key] !== 'number') {
      //   console.log(typeof obj[key], key);
      // }
      map[key] = Number(obj[key]);
    });
    state.dataObject = { ...state.dataObject, ...map };
  },
  [defineTypes.SET_CHECK_OBJECT](state, obj) {
    state.checkObject = { ...state.checkObject, ...obj };
  },
  [defineTypes.CONTROL_SET_STATE](state, obj) {
    Object.keys(obj).forEach(key => {
      state[key] = obj[key];
    });
  }
};
