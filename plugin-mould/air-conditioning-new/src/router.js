import Vue from 'vue';
import Router from 'vue-router';
import { changeBarColor } from '@PluginInterface'; // 主体接口：关闭插件页、获取设备信息、改变状态栏颜色

const Home = r => require.ensure([], () => r(require('./views/Home')), 'home');
const Hidden = r => require.ensure([], () => r(require('./views/Hidden')), 'hidden');
const ErrorWarning = r => require.ensure([], () => r(require('./views/ErrorWarning')), 'errorWarning');
const Offline = r => require.ensure([], () => r(require('./views/Offline')), 'offline');

// 高级功能倒三角进入
export const functionPage = {
  Test: r => require.ensure([], () => r(require('./views/functionPage/Test'))),
  SweepConst: r => require.ensure([], () => r(require('./views/functionPage/SweepConst'))),
  Electric: r => require.ensure([], () => r(require('./views/functionPage/Electric'))),
  Noise: r => require.ensure([], () => r(require('./views/functionPage/Noise'))),
  AssHt: r => require.ensure([], () => r(require('./views/functionPage/AssHt'))),
  UDFanPort: r => require.ensure([], () => r(require('./views/functionPage/UDFanPort'))),
  AreaFan: r => require.ensure([], () => r(require('./views/functionPage/AreaFan')))
};

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
      components: {
        default: Home,
        hidden: Hidden
      },
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
      path: '/Hidden',
      name: 'Hidden',
      component: Hidden
    },
    {
      path: '/ErrorWarning',
      name: 'ErrorWarning',
      component: ErrorWarning
    },
    {
      path: '/Test',
      name: 'Test',
      component: functionPage.Test
    },
    {
      path: '/SweepConst',
      name: 'SweepConst',
      component: functionPage.SweepConst
    },
    {
      path: '/Electric',
      name: 'Electric',
      component: functionPage.Electric
    },
    {
      path: '/Noise',
      name: 'Noise',
      components: {
        default: functionPage.Noise
      }
    },
    {
      path: '/AssHt',
      name: 'AssHt',
      component: functionPage.AssHt
    },
    {
      path: '/UDFanPort',
      name: 'UDFanPort',
      component: functionPage.UDFanPort
    },
    {
      path: '/AreaFan',
      name: 'AreaFan',
      component: functionPage.AreaFan
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
