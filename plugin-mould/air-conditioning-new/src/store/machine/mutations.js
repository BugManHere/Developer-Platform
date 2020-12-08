import { defineTypes } from '../types';

export default {
  [defineTypes.SET_BASEDATA](state, map) {
    state.baseData = { ...state.baseData, ...map };
  },
  [defineTypes.MACHINE_SET_STATE](state, obj) {
    Object.keys(obj).forEach(key => {
      state[key] = obj[key];
    });
  }
};
