import Vue from 'vue'
import App from './App.vue'
import router from './router';
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import './assets/scss/global.scss';

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  router,
}).$mount('#app')



