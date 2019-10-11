import Vue from 'vue';
import Router from 'vue-router';

const Home = r =>
  require.ensure([], () => r(require('./views/Home.vue')));
const ProductInfo = r =>
  require.ensure([], () => r(require('./views/ProductInfo.vue')));

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/Home',
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/ProductInfo',
      name: 'ProductInfo',
      component: ProductInfo,
    },
  ]
})
