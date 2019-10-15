import * as type from './types';
// 同步操作放这里
export default {
  [type.SET_STATE](state, [key, val]) {
    state[key] = val;
  },
};
