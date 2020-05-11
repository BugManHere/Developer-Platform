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
const Timer = r =>
  require.ensure([], () => r(require('./views/functionPage/Timer')));

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
      path: '/Timer',
      name: 'Timer',
      component: Timer
    },
  ]
});
