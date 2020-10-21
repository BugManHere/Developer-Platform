import Vue from 'vue';
import Router from 'vue-router';
import { changeBarColor } from '@PluginInterface'; // 主体接口：关闭插件页、获取设备信息、改变状态栏颜色

const Home = () => import('@views/Home');
const Hidden = () => import('@views/Hidden');
const ErrorWarning = () => import('@views/ErrorWarning');
const Offline = () => import('@views/Offline');

// 高级功能倒三角进入
export const functionPage = {
  Test: () => import('@views/functionPage/Test'),
  SweepConst: () => import('@views/functionPage/SweepConst'),
  Electric: () => import('@views/functionPage/Electric'),
  Noise: () => import('@views/functionPage/Noise'),
  AssHt: () => import('@views/functionPage/AssHt'),
  UDFanPort: () => import('@views/functionPage/UDFanPort'),
  AreaFan: () => import('@views/functionPage/AreaFan')
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
