import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import devModule from './module/dev';
import tempModule from './module/temp';
import pulicModule from './module/pulic';
import userModule from './module/user';

Vue.use(Vuex);

export default new Vuex.Store({
  getters,
  actions,
  mutations,
  modules: {
    devModule,
    tempModule,
    userModule,
    pulicModule
  },
  strict: process.env.NODE_ENV !== 'production'
});