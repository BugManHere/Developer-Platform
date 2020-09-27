import Loading from './Loading.vue';

const LOADING = {
  newLoading: null,
  vm: null,
  el: null,
  install(Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue;
    }
    Vue.component('Loading', Loading);

    function display() {
      if (LOADING.vm) return;
      const VueLoading = Vue.extend({
        render(h) {
          return h('Loading');
        }
      });
      LOADING.newLoading = new VueLoading();
      LOADING.vm = LOADING.newLoading.$mount();
      LOADING.el = LOADING.vm.$el;
      document.body.appendChild(LOADING.el);
    }

    function hidden() {
      if (!LOADING.vm) return;
      document.body.removeChild(LOADING.el);
      LOADING.newLoading.$destroy();
      LOADING.vm = null;
    }

    Vue.prototype.$loading = {
      show() {
        display();
      },
      hide() {
        hidden();
      }
    };
  }
};

export default LOADING;
