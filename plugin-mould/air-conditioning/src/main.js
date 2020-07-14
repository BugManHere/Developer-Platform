import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import VueClipboard from 'vue-clipboard2';
import axios from 'axios';

import { View, Page } from 'gree-ui';

import { closePage, getInfo } from '@PluginInterface'; // 主体接口：关闭插件页、获取设备信息、改变状态栏颜色
import App from './App';
import router from './router';
import store from './store';

import debugMixin from './mixins/utils/debug'; // 开发环境初始化
import initMixin from './mixins/utils/init'; // 生产环境初始化

import './assets/js/flexible';
import './assets/scss/global.scss';
import language from './utils/language'; // 对i18n的封装

import { SET_STATE } from './store/types';

// axios.defaults.baseURL = 'http://8.210.116.167:3000';   //配置接口地址
axios.defaults.baseURL = 'http://localhost:3000'; // 配置接口地址
axios.defaults.timeout = 5000; // 响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // 配置请求头

// 安装插件
Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(language);
Vue.use(VueClipboard);
Vue.component(View.name, View);
Vue.component(Page.name, Page);

// 使用语言包
const i18n = new VueI18n({
  locale: 'zh_CN',
  silentTranslationWarn: true,
  messages: {
    en: require('./i18n/en'),
    zh_CN: require('./i18n/zh_CN')
  }
});

Vue.config.productionTip = false;

const dev = process.env.NODE_ENV === 'development';

async function createVue() {
  const vm = new Vue({
    // el: '#app',
    mixins: dev ? [debugMixin] : [initMixin],
    // mixins: [initMixin],
    render: h => h(App),
    router,
    store,
    i18n
  });
  window.myvm = vm;
  window.storage = new Storage();

  // 如果是开发模式，加载服务器/缓存配置
  if (dev) {
    // 解析传入参数, id: 设备key, admin: 用户名
    let { id, admin } = router.currentRoute.query;
    const storage = window.storage;
    // 已有id，则记录，没有则读取
    if (id) {
      // 更新mac
      vm.$store.commit(SET_STATE, ['mac', id]);
      // 去服务器请求设备配置
      const res = await axios.get('/plugin/config', {
        params: {
          id, admin
        }
      });
      // 清空缓存配置
      storage.clear();
      // 缓存配置
      localStorage.setItem('device_config_id', id);
      storage.set('config', res.data);
    } else {
      // 取出缓存的配置
      let oldId = localStorage.getItem('device_config_id');
      // 更新mac
      vm.$store.commit(SET_STATE, ['mac', oldId]);
    }

    vm.$router.push('/Home');
  } else {
    vm.init();
  }

  // 挂载到#app上
  vm.$mount('#app');
}

// 定义一个类，每个mac在localStorage分配一个空间
class Storage {
  constructor(props) {
    this.props = props || {};
    this.source = this.props.source || window.localStorage;
    this.initRun();
  }
  // 初始化
  initRun() {
    this.source[store.state.mac] || window.localStorage.setItem(store.state.mac, '{}');
  }
  // 设置数据
  set(key, value, mac = store.state.mac) {
    const data = JSON.parse(this.source[mac]);
    data[key] = value;
    window.localStorage.setItem(mac, JSON.stringify(data));
    return value;
  }
  // 获取数据
  get(key, mac = store.state.mac) {
    const data = JSON.parse(this.source[mac] || '{}');
    return data[key];
  }
  // 删除操作
  remove(key, mac = store.state.mac) {
    const data = JSON.parse(this.source[mac]);
    const value = data[key];
    delete data[key];
    window.localStorage.setItem(mac, JSON.stringify(data));
    return value;
  }
  // 清除操作
  clear(mac = store.state.mac) {
    window.localStorage.setItem(mac, '{}');
    return {};
  }
}

/* 启用页面调试器 */
if (['test', 'debug'].includes(process.env.VUE_APP_MODE)) {
  const VConsole = require('vconsole/dist/vconsole.min.js');
  // eslint-disable-next-line no-new
  new VConsole();
}

dev ? createVue() : '';

/* ********************************* Native Func ********************************* */

/**
 * @description 安卓后退键方法。如果开始预约或者故障则直接退出。预约界面调用取消预约的按键，模式选择页面时调用取消选择的按键。其他就返回上一层
 */
window.backButton = function backButton() {
  const { name } = router.currentRoute;
  if (name === 'Error' || name === 'Home' || name === 'Offline') {
    closePage();
  } else if (name === 'Voice' || name === 'Sweep' || name === 'Air') {
    router.push({ name: 'Home' }).catch(err => { err; });
  } else {
    router.back(-1);
  }
};

/**
 * @description APP从后台切回来之后同步数据 - iOS
 */
window.onReFocus = function onReFocus(msg) {
  msg;
  getInfo(store.state.mac)
    .then(res => {
      const deviceInfo = JSON.parse(res);
      store.$store.commit('SET_DEVICE_INFO', deviceInfo);
    })
    .catch(err => {
      err;
    });
};

/**
 * @description APP从后台切回来之后同步数据 - Android
 */
window.onResume = function onResume(msg) {
  msg;
  getInfo(store.state.mac)
    .then(res => {
      const deviceInfo = JSON.parse(res);
      store.commit('SET_DEVICE_INFO', deviceInfo);
    })
    .catch(err => {
      err;
    });
};

// 根据加载页面改变状态栏颜色
window.init = function init() {
  createVue();
};

