import Popup from './index.vue';

const POPUP = {
  newPopup: null,
  vm: null,
  el: null,
  children: null,
  install(Vue) {
    Vue.component('Popup', Popup);

    function display(map) {
      const VuePOPUP = Vue.extend({
        render(h) {
          let props = map;
          return h('Popup', { props });
        }
      });
      POPUP.newPopup = new VuePOPUP();
      POPUP.vm = POPUP.newPopup.$mount();
      POPUP.el = POPUP.vm.$el;

      document.body.appendChild(POPUP.el);
    }

    function hidden() {
      if (!POPUP.vm) return;
      document.body.removeChild(POPUP.el);
      POPUP.newPopup.$destroy();
      POPUP.vm = null;
    }

    Vue.prototype.$popup = {
      show(map) {
        display(map);
      },
      hide() {
        hidden();
      }
    };
  }
};

export default POPUP;
