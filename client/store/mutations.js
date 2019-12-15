import * as type from './types';
// 同步操作放这里
export default {
  [type.SET_DEV_OBJECT](state, [key, val]) {
    state.devModule[key] = val;
  },
  [type.SET_FUNC_OBJECT](state, [key, val]) {
    state.funcModule[key] = val;
  },
  [type.SET_FUNC_DEFINE](state, [key, val]) {
    state.funcModule.funcDefineList[key] = val;
  },
};
