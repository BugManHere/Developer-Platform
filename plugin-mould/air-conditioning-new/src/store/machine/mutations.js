import * as types from './types';

export default {
  [types.SET_BASEDATA](state, map) {
    state.baseData = { ...state.baseData, ...map };
  },
  [types.SET_STATE](state, obj) {
    Object.keys(obj).forEach(key => {
      state[key] = obj[key];
    });
  },
  [types.GET_STATUS_NAME]() {
    console.log('2');
    return 123;
  }
};
