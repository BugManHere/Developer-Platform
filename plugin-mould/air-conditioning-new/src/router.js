import Vue from 'vue';
import Router from 'vue-router';
import { changeBarColor } from '@PluginInterface'; // 主体接口：关闭插件页、获取设备信息、改变状态栏颜色

const Home = r => require.ensure([], () => r(require('./views/Home')), 'home');
const Offline = r => require.ensure([], () => r(require('./views/Offline')), 'offline');
const ErrorWarning = r => require.ensure([], () => r(require('./views/ErrorWarning')), 'ErrorWarning');

// 高级功能倒三角进入
const Test = r => require.ensure([], () => r(require('./views/functionPage/Test')));
const SweepConst = r => require.ensure([], () => r(require('./views/functionPage/Sweep-const')));
const Electric = r => require.ensure([], () => r(require('./views/functionPage/Electric')));
const Noise = r => require.ensure([], () => r(require('./views/functionPage/Noise.vue')));
const AssHt = r => require.ensure([], () => r(require('./views/functionPage/AssHt')));
const UDFanPort = r => require.ensure([], () => r(require('./views/functionPage/UDFanPort')));

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/Home'
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Offline',
      name: 'Offline',
      component: Offline
    },
    {
      path: '/ErrorWarning',
      name: 'ErrorWarning',
      component: ErrorWarning
    },
    {
      path: '/Test',
      name: 'Test',
      component: Test
    },
    {
      path: '/SweepConst',
      name: 'SweepConst',
      component: SweepConst
    },
    {
      path: '/Electric',
      name: 'Electric',
      component: Electric
    },
    {
      path: '/Noise',
      name: 'Noise',
      component: Noise
    },
    {
      path: '/AssHt',
      name: 'AssHt',
      component: AssHt
    },
    {
      path: '/UDFanPort',
      name: 'UDFanPort',
      component: UDFanPort
    }
  ]
});
// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果点击了“预览效果”，就刷新页面
  if (from.name && to.path === '/Loading') {
    router.go(0);
  }
  // 顶栏颜色操作
  const color = '#F4F4F4';
  changeBarColor(color);
  next();
});

export default router;
