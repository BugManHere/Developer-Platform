import * as type from './types';
// 同步操作放这里
export default {
  [type.SET_DEV_MODULE](state, [key, val]) {
    state.devModule[key] = val;
  },
  [type.SET_FUNC_MODULE](state, [key, val]) {
    state.funcModule[key] = val;
  },
  [type.SET_PULIC_MODULE](state, [key, val]) {
    state.pulicModule[key] = val;
  },
  [type.SET_FUNC_DEFINE](state, [key, val]) {
    state.funcModule.funcDefineList[key] = val;
  },
  [type.SET_EXCLUDE_MAP](state, [key, val]) {
    state.funcModule.excludeMap[key] = val;
  },
  [type.SET_HIDE_MAP](state, [key, val]) {
    state.funcModule.hideMap[key] = val;
  },
  [type.SET_DISABLE_MAP](state, [key, val]) {
    state.funcModule.disableMap[key] = val;
  },
};
