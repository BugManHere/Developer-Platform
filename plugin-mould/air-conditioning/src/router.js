import Vue from 'vue';
import Router from 'vue-router';

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

const Status = r =>
  require.ensure([], () => r(require('./views/functionPage/Status')), 'status');  

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

Vue.use(Router);

export default new Router({
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
      // meta: {
      //   keepAlive: true
      // },
    },
    {
      path: '/Offline',
      name: 'Offline',
      component: Offline
    },
    {
      path: '/Status',
      name: 'Status',
      component: Status
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
  ]
});
