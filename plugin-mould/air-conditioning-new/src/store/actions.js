import * as types from './types';

export default {
  [types.STATE_MACHINE_INTERFACE]({ commit, dispatch }, data) {
    commit('control/SET_DATA_OBJECT', data);
    dispatch('control/SEND_CTRL', data);
  },
  [types.STATE_MACHINE_INITDATA]({ commit }, data) {
    const dev = process.env.NODE_ENV === 'development';
    if (!dev) return;
    commit('control/SET_DATA_OBJECT', data);
    commit('control/SET_CHECK_OBJECT', data);
  }
};
