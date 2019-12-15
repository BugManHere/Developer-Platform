import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import devModule from './devModule/module';
import funcModule from './funcModule/module';
import userModule from './userModule/module';
import pulicModule from './pulicModule/module';

Vue.use(Vuex);

export default new Vuex.Store({
  getters,
  actions,
  mutations,
  modules: {
    devModule,
    funcModule,
    userModule,
    pulicModule
  },
  strict: process.env.NODE_ENV !== 'production'
});