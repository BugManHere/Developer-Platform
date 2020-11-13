import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

Vue.use(Vuex);

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  modules: {},
  strict: process.env.NODE_ENV !== 'production'
};
