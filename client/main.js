import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.css';

import './assets/scss/global.scss';
import store from './store';

import vToast from '@globalComponents/Toast/index';
import vLoading from '@globalComponents/Loading/index';
import vConfirm from '@globalComponents/Confirm/index';
import vInput from '@globalComponents/Input/index';
import vTop from './directives/Top/index';
import vLift from './directives/lift';
import vShuttle from './directives/shuttle';
import vFocus from './directives/focus';

import VueClipboard from 'vue-clipboard2';

Vue.use(Vuex);
Vue.use(vToast);
Vue.use(vLoading);
Vue.use(vConfirm);
Vue.use(vInput);
Vue.use(VueClipboard);
// 注册全局指令
Vue.directive('lift', vLift);
Vue.directive('shuttle', vShuttle);
Vue.directive('focus', vFocus);
Vue.directive('gotop', vTop);

Vue.config.productionTip = false;

var myCommponment = Vue.extend({
  template: '<div class="test"><transition>demo</transition></div>'
});

Vue.component('myDemo', myCommponment);

const vm = new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');

window.myvm = vm;

Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

// 新建一个类，在localStorage基础上新增过期清理机制
class storage {
  constructor(props) {
    this.props = props || {};
    this.source = this.props.source || window.localStorage;
    this.initRun();
  }
  // 判断过期时删除数据
  initRun() {
    const reg = new RegExp('__expires__');
    let data = this.source;
    let list = Object.keys(data);
    if (list.length > 0) {
      list.map(key => {
        if (!reg.test(key)) {
          let now = Date.now();
          let expires = data[`${key}__expires__`] || Date.now + 1;
          if (now >= expires) {
            this.remove(key);
          }
        }
        return key;
      });
    }
  }
  // 必填项：key、value
  // 选填项：expired 单位：分钟
  set(key, value, expired) {
    let source = this.source;
    source[key] = JSON.stringify(value);
    if (expired) {
      source[`${key}__expires__`] = Date.now() + 1000 * 60 * expired;
    }
    return value;
  }
  // 获取数据时判断是否过期，过期返回空
  get(key) {
    const source = this.source,
      expired = source[`${key}__expires__`] || Date.now + 1;
    const now = Date.now();

    if (now >= expired) {
      this.remove(key);
      return;
    }
    const value = source[key] ? JSON.parse(source[key]) : source[key];
    return value;
  }
  // 删除操作
  remove(key) {
    const data = this.source,
      value = data[key];
    delete data[key];
    delete data[`${key}__expires__`];
    return value;
  }
}

window.storage = new storage();
