/*
 * @Author: Jerry-Rain
 * @Date: 2019-09-10 15:34:24
 * @LastEditors: Jerry-Rain
 * @LastEditTime: 2019-12-13 00:44:36
 * @Description: 
 */
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
  
// 高级功能倒三角进入
const Sweep = r =>
  require.ensure([], () => r(require('./views/functionPage/Sweep')));
const SmartWind = r =>
  require.ensure([], () => r(require('./views/functionPage/SmartWind')));
const NoBodySave = r =>
  require.ensure([], () => r(require('./views/functionPage/NoBodySave')));
const Lig = r =>
  require.ensure([], () => r(require('./views/functionPage/Lig')));
const AssHt = r =>
  require.ensure([], () => r(require('./views/functionPage/AssHt')));
const Dazzling = r =>
  require.ensure([], () => r(require('./views/functionPage/Dazzling')));

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
  ]
});
