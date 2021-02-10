import ScrollConfirm from './index.vue';

const SCROLLCONFIRM = {
  newScrollConfirm: null,
  vm: null,
  el: null,
  install(Vue) {
    Vue.component('ScrollConfirm', ScrollConfirm);

    function display(map) {
      const VueSCROLLCONFIRM = Vue.extend({
        render(h) {
          let props = map;
          return h('ScrollConfirm', { props });
        }
      });
      SCROLLCONFIRM.newScrollConfirm = new VueSCROLLCONFIRM();
      SCROLLCONFIRM.vm = SCROLLCONFIRM.newScrollConfirm.$mount();
      SCROLLCONFIRM.el = SCROLLCONFIRM.vm.$el;
      document.body.appendChild(SCROLLCONFIRM.el);
    }

    Vue.prototype.$scrollConfirm = {
      show(map) {
        display(map);
      }
    };
  }
};

export default SCROLLCONFIRM;
