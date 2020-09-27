import Vue from 'vue';
import Router from 'vue-router';

const Home = r => require.ensure([], () => r(require('./views/Home.vue')));
const Template = r => require.ensure([], () => r(require('./views/Template.vue')));
const Device = r => require.ensure([], () => r(require('./views/Device.vue')));
const Account = r => require.ensure([], () => r(require('./views/Account.vue')));

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/Account/Login'
    },
    {
      path: '/',
      redirect: '/Home'
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/Account/:loginType',
      name: 'Account',
      component: Account,
      props: true
    },
    {
      path: '/Template/:tempID',
      name: 'Template',
      component: Template,
      props: true
    },
    {
      path: '/Device/:deviceKey',
      name: 'Device',
      component: Device,
      props: true
    }
  ]
});
// 路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == '/Account/Login') {
    next();
  } else {
    isLogin ? next() : next('/Account/Login');
  }
});

export default router;
