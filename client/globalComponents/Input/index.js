import Input from './index.vue';

const INPUT = {
  newInput: null,
  vm: null,
  el: null,
  children: null,
  install(Vue) {
    Vue.component('Input', Input);

    function display(map) {
      const VueINPUT = Vue.extend({
        render(h) {
          let props = map;
          return h('Input', { props });
        }
      });
      INPUT.newInput = new VueINPUT();
      INPUT.vm = INPUT.newInput.$mount();
      INPUT.el = INPUT.vm.$el;
      INPUT.children = INPUT.newInput && INPUT.newInput.$children && INPUT.newInput.$children[0];
      document.body.appendChild(INPUT.el);
    }

    function hidden() {
      if (!INPUT.children) return;
      INPUT.children.isShow = false;
      // document.body.removeChild(INPUT.el);
      // INPUT.newInput.$destroy();
      // INPUT.vm = null;
    }

    Vue.prototype.$input = {
      show(map) {
        display(map);
      },
      hide() {
        hidden();
      }
    };
  }
};

export default INPUT;
