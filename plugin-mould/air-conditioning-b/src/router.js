import Vue from 'vue';
import Router from 'vue-router';
import { changeBarColor } from '@PluginInterface'; // 主体接口：关闭插件页、获取设备信息、改变状态栏颜色

const Home = r =>
  require.ensure(
    [],
    () => r(require('./views/Home')),
    'home'
  );
const Offline = r =>
  require.ensure([], () => r(require('./views/Offline')), 'offline');

const ErrorPage = r =>
  require.ensure([], () => r(require('./views/Error')), 'error');
  
// 高级功能倒三角进入
const Test = r =>
  require.ensure([], () => r(require('./views/functionPage/Test')));
const Sweep = r =>
  require.ensure([], () => r(require('./views/functionPage/Sweep')));
const SmartWind = r =>
  require.ensure([], () => r(require('./views/functionPage/SmartWind')));
const NoBodySave = r =>
  require.ensure([], () => r(require('./views/functionPage/NoBodySave')));
const Lig = r =>
  require.ensure([], () => r(require('./views/functionPage/Lig')));
const Air = r =>
  require.ensure([], () => r(require('./views/functionPage/Air')));
const AssHt = r =>
  require.ensure([], () => r(require('./views/functionPage/AssHt')));
const Dazzling = r =>
  require.ensure([], () => r(require('./views/functionPage/Dazzling')));
const UDFanPort = r =>
  require.ensure([], () => r(require('./views/functionPage/UDFanPort')));
const Electric = r =>
  require.ensure([], () => r(require('./views/functionPage/Electric')));
const Humi = r =>
  require.ensure([], () => r(require('./views/functionPage/Humi')));
const Loop = r =>
  require.ensure([], () => r(require('./views/functionPage/Loop')));
const Sleep = r =>
  require.ensure([], () => r(require('./views/functionPage/Sleep')));
const MusicCollect = r =>
  require.ensure([], () => r(require('./../src/components/Card/music/page/collect.vue')));
const MusicDetail = r =>
  require.ensure([], () => r(require('./../src/components/Card/music/page/detail.vue')));
const MusicPlay = r =>
  require.ensure([], () => r(require('./../src/components/Card/music/page/play.vue')));
const SkillDetail = r =>
  require.ensure([], () => r(require('./../src/components/Card/music/page/skillDetail.vue')));

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
      },
    },
    {
      path: '/Offline',
      name: 'Offline',
      component: Offline
    },
    {
      path: '/Error',
      name: 'Error',
      component: ErrorPage
    },
    {
      path: '/Test',
      name: 'Test',
      component: Test
    },
    {
      path: '/Sweep',
      name: 'Sweep',
      component: Sweep
    },
    {
      path: '/SmartWind',
      name: 'SmartWind',
      component: SmartWind
    },
    {
      path: '/NoBodySave',
      name: 'NoBodySave',
      component: NoBodySave
    },
    {
      path: '/Air',
      name: 'Air',
      component: Air
    },
    {
      path: '/Lig',
      name: 'Lig',
      component: Lig
    },
    {
      path: '/AssHt',
      name: 'AssHt',
      component: AssHt
    },
    {
      path: '/Dazzling',
      name: 'Dazzling',
      component: Dazzling
    },
    {
      path: '/UDFanPort',
      name: 'UDFanPort',
      component: UDFanPort
    },
    {
      path: '/Electric',
      name: 'Electric',
      component: Electric
    },
    {
      path: '/Humi',
      name: 'Humi',
      component: Humi
    },
    {
      path: '/Loop',
      name: 'Loop',
      component: Loop
    },
    {
      path: '/Sleep',
      name: 'Sleep',
      component: Sleep
    },
    {
      path: '/MusicCollect',
      name: 'MusicCollect',
      component: MusicCollect
    },
    {
      path: '/MusicDetail',
      name: 'MusicDetail',
      component: MusicDetail
    },
    {
      path: '/MusicPlay',
      name: 'MusicPlay',
      component: MusicPlay,
      meta: {
        keepAlive: true
      },
    },
    {
      path: '/SkillDetail',
      name: 'SkillDetail',
      component: SkillDetail
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
  let color = '#404040';
  if (to.name === 'Error') {
    color = '#ddd5a3';
  } else if (to.name === 'Offline') {
    color = window.myvm.$store.state.dataObject.Mod === window.myvm.$store.state.ModHeat ? '#f78d00' : '#6ba0e2';
  }
  changeBarColor(color);
  next();
});

export default router;
