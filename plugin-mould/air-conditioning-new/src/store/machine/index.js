import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  modules: {},
  strict: process.env.NODE_ENV !== 'production'
};
