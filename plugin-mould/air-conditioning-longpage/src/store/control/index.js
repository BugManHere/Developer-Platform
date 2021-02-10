import actions from './actions';
import mutations from './mutations';
import state from './state';

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {},
  strict: process.env.NODE_ENV !== 'production'
};
