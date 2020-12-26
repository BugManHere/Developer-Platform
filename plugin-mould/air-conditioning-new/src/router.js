import Vue from 'vue';
import Router from 'vue-router';
import { changeBarColor } from '@PluginInterface'; // 主体接口：关闭插件页、获取设备信息、改变状态栏颜色

const Home = r => require.ensure([], () => r(require('./views/Home')), 'home');
const Hidden = r => require.ensure([], () => r(require('./views/Hidden')), 'hidden');
// const ErrorWarning = r => require.ensure([], () => r(require('./views/ErrorWarning')), 'errorWarning');
const Offline = r => require.ensure([], () => r(require('./views/Offline')), 'offline');

const componentList = ['Test', 'SweepConst', 'Noise', 'AssHt', 'UDFanPort', 'AreaFan', 'SvSt'];

// 引入component
const requireComponents = componentNames => {
  const result = {};
  componentNames.forEach(componentName => {
    result[componentName] = r => require.ensure([], () => r(require(`@/views/functionPage/${componentName}`)));
  });
  return result;
};

// 注册component
const registerRoute = componentNames => {
  return componentNames.map(componentName => {
    return {
      path: `/${componentName}`,
      name: componentName,
      component: functionPage[componentName]
    };
  });
};

// 高级功能二级页面
export const functionPage = requireComponents(componentList);

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    ...registerRoute(componentList),
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
    }
    // {
    //   path: '/ErrorWarning',
    //   name: 'ErrorWarning',
    //   component: ErrorWarning
    // }
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
