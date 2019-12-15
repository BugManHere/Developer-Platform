import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue'
import router from './router';
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.css";

import vToast from '@components/Toast/index';
import vLoading from '@components/Loading/index';
import './assets/scss/global.scss';
import store from './store';

import transitionFade from './directives/transition-fade';
import './directives/transition-fade';

Vue.use(Vuex);
Vue.use(vToast);
Vue.use(vLoading);
// 注册全局指令
Vue.directive('fade', transitionFade);

Vue.config.productionTip = false

var myCommponment = Vue.extend({
  template: '<div class="test"><transition>demo</transition></div>',
})

Vue.component('myDemo', myCommponment);

const vm = new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

window.myvm = vm;

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
