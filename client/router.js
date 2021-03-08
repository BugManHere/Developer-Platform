import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

const Home = r => require.ensure([], () => r(require('./views/Home.vue')));
const Define = r => require.ensure([], () => r(require('./views/Define.vue')));
const Account = r => require.ensure([], () => r(require('./views/Account.vue')));

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
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
      path: '/Define',
      name: 'Define',
      component: {
        render(h) {
          return h('router-view');
        }
      },
      redirect: '/Define',
      children: [
        {
          path: '/Define/Template/:params',
          name: 'Template',
          component: Define,
          props: true
        },
        {
          path: '/Define/Device/:params',
          name: 'Device',
          component: Define,
          props: true
        }
      ]
    }
  ]
});
// 路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.name === 'Account') {
    console.log('--Login--');
  } else if (!isLogin) {
    next('/Account/Login');
    return;
  } else if (to.name === 'Device') {
    store.commit('SET_PULIC_MODULE', { developType: 0 });
  } else if (to.name === 'Template') {
    store.commit('SET_PULIC_MODULE', { developType: 1 });
  }

  next();
});

export default router;
