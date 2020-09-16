import Confirm from './index.vue';

const CONFIRM = {
  newConfirm: null,
  vm: null,
  el: null,
  install(Vue) {
    Vue.component('Confirm', Confirm);

    function display(map) {
      const VueCONFIRM = Vue.extend({
        render(h) {
          let props = map;
          return h('Confirm', { props });
        }
      });
      CONFIRM.newConfirm = new VueCONFIRM();
      CONFIRM.vm = CONFIRM.newConfirm.$mount();
      CONFIRM.el = CONFIRM.vm.$el;
      document.body.appendChild(CONFIRM.el);
    }

    Vue.prototype.$confirm = {
      show(map) {
        display(map);
      }
    };
  }
};

export default CONFIRM;
