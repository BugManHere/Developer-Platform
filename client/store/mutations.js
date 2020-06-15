import * as type from './types';
// 同步操作放这里
export default {
  [type.SET_DEV_MODULE](state, [key, val]) {
    state.devModule[key] = val;
  },
  [type.SET_TEMP_MODULE](state, [key, val]) {
    state.tempModule[key] = val;
  },
  [type.SET_PULIC_MODULE](state, [key, val]) {
    state.pulicModule[key] = val;
  },
  [type.CHANGE_TEMPLATE](state, val) {
    const productID = state.tempModule.tempID.split('&')[0];
    const seriesID = state.tempModule.tempID.split('&')[1];
    const template = state.tempModule.templates.filter(item => item.productID === productID)
      .find(item => item.seriesID === seriesID);
    template.funcDefine = val.funcDefine;
    val.editTime && (template.editTime = val.editTime);
    val.editUser && (template.editUser = val.editUser);
  },
};
