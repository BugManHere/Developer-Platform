import Vue from 'vue';
import Vuex from 'vuex';
import controlMoudle from './control/index';
import machineMoudle from './machine/index';
import state from './state';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  actions,
  getters,
  modules: {
    control: controlMoudle, // 业务模块
    machine: machineMoudle // 状态机模块
  }
});
