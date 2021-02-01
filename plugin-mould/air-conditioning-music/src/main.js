import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

// 引入第三方
import { Page, View, Lazyload } from 'gree-ui';
import './assets/js/flexible';
import './assets/scss/global.scss';

// 引入内部文件
import { closePage, getInfo } from '@PluginInterface'; // 主体接口：关闭插件页、获取设备信息、改变状态栏颜色
import { types } from '@/store/types';
import App from './App';
import debugMixin from './mixins/utils/debug'; // 开发环境初始化
import initMixin from './mixins/utils/init'; // 生产环境初始化
import unfoldEvent from '@/directives/unfold';
import router from './router';
import store from './store';
import language from './utils/language'; // 对i18n的封装
import Storage from './utils/storage'; // 对i18n的封装

// 安装插件
Vue.use(VueI18n);
Vue.use(language);
Vue.use(Lazyload, { loading: require('../src/assets/img/music/loading.png') });
Vue.use(Vuex);
Vue.component(View.name, View);
Vue.component(Page.name, Page);

// 注册全局指令
Vue.directive('unfold', unfoldEvent);

// 使用语言包
const i18n = new VueI18n({
  locale: 'zh_CN',
  messages: {
    en: require('./i18n/en'),
    zh_CN: require('./i18n/zh_CN')
  },
  silentTranslationWarn: true
});

Vue.config.productionTip = false;

const dev = process.env.NODE_ENV === 'development';

async function createVue() {
  const vm = new Vue({
    // el: '#app',
    mixins: [dev ? debugMixin : initMixin],
    render: h => h(App),
    router,
    store,
    i18n
  });
  window.myvm = vm;

  console.log(`当前服务器地址：${process.env.VUE_APP_SERVE_URL}`);

  window.storage = new Storage();

  const isLocalConfig = process.env.VUE_APP_MODE === 'local'; // localconfig模式下强制启用本地配置
  const isServeConfig = dev; // 如果是development环境，获取线上配置

  // 如果是development环境且不处于localconfig模式，加载服务器/缓存配置
  if (isServeConfig && !isLocalConfig) {
    // 解析传入参数, id: 设备key, admin: 用户名
    let { id, admin } = router.currentRoute.query;
    // let id = '5f4cc7c340a7fa41bc714160';
    // let admin = 'a1260011042@163.com';
    const storage = window.storage;
    // 已有id，则去线上获取配置，没有则读取localstorage配置
    if (id) {
      axios.defaults.baseURL = `${process.env.VUE_APP_SERVE_URL}:3000`; // 配置接口地址
      axios.defaults.timeout = 5000; // 响应时间
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // 配置请求头

      // 更新mac
      vm.$store.commit(types.CONTROL_SET_STATE, { mac: id });
      // 去服务器请求设备配置
      const res = await axios.get('/plugin/config', {
        params: {
          id,
          admin
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
      vm.$store.commit(types.CONTROL_SET_STATE, { mac: oldId });
    }
  }
  // 挂载到#app上
  vm.$mount('#app');
  router.replace('Home').catch(e => console.log(e));
}

/* 启用页面调试器 */
if (['test', 'debug'].includes(process.env.VUE_APP_MODE)) {
  const VConsole = require('vconsole/dist/vconsole.min.js');
  new VConsole();
}

if (dev) {
  createVue();
  require('../api/mock/index.js');
}

/* ********************************* Native Func ********************************* */

/**
 * @description 安卓后退键方法。如果开始预约或者故障则直接退出。预约界面调用取消预约的按键，模式选择页面时调用取消选择的按键。其他就返回上一层
 */
window.backButton = function backButton() {
  const { name } = router.currentRoute;
  if (['Home', 'Offline', 'Error'].includes(name)) {
    closePage();
  } else {
    router.back(-1);
  }
};

/**
 * @description APP从后台切回来之后同步数据 - iOS
 */
window.onReFocus = function onReFocus(msg) {
  msg;
  getInfo(store.state.control.mac)
    .then(res => {
      const deviceInfo = JSON.parse(res);
      store.commit(types.SET_DEVICE_INFO, deviceInfo);
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
  getInfo(store.state.control.mac)
    .then(res => {
      const deviceInfo = JSON.parse(res);
      store.commit(types.SET_DEVICE_INFO, deviceInfo);
    })
    .catch(err => {
      err;
    });
};

window.init = function init() {
  createVue();
};
