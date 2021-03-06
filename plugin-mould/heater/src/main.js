import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';

import { View, Page } from 'gree-ui';

import { closePage, getInfo, changeBarColor } from '@PluginInterface'; // 主体接口：关闭插件页、获取设备信息、改变状态栏颜色
import App from './App';
import router from './router';
import store from './store';

import debugMixin from './mixins/utils/debug'; // 开发环境初始化
import initMixin from './mixins/utils/init'; // 生产环境初始化

import './assets/js/flexible';
import './assets/scss/global.scss';
import language from './utils/language'; // 对i18n的封装

// 安装插件
Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(language);
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
  set(key, value) {
    const data = JSON.parse(this.source[store.state.mac]);
    data[key] = value;
    window.localStorage.setItem(store.state.mac, JSON.stringify(data));
    return value;
  }
  // 获取数据
  get(key) {
    const data = JSON.parse(this.source[[store.state.mac]]);
    return data[key];
  }
  // 删除操作
  remove(key) {
    const data = JSON.parse(this.source[[store.state.mac]]);
    const value = data[key];
    delete data[key];
    window.localStorage.setItem(store.state.mac, JSON.stringify(data));
    return value;
  }
}

function createVue() {
  const vm = new Vue({
    el: '#app',
    mixins: dev ? [debugMixin] : [initMixin],
    // mixins: [initMixin],
    render: h => h(App),
    router,
    store,
    i18n
  });
  dev ? '' : vm.init();
  window.storage = new Storage();
  window.myvm = vm;
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
  router.beforeEach((to, from, next) => {
    let color = '#404040';
    if (to.name === 'Error') {
      color = '#ddd5a3';
    } else if (to.name === 'Offline') {
      color = store.state.dataObject.Mod === 4 ? '#f78d00' : '#6ba0e2';
    }
    changeBarColor(color);
    next();
  });
};

