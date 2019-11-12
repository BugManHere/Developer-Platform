import Vue from 'vue'
import Vuex from 'vuex';
import App from './App.vue'
import router from './router';
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.css";

import './assets/scss/global.scss';
import store from './store';

Vue.use(Vuex);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')



