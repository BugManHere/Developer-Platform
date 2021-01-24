import Input from './index.vue';
const animationSecond = 0.5;

const INPUT = {
  newInput: [],
  vm: [],
  el: [],
  children: [],
  install(Vue) {
    Vue.component('Input', Input);

    function display(map) {
      const VueINPUT = Vue.extend({
        render(h) {
          let props = map;
          return h('Input', { props });
        }
      });
      INPUT.newInput.unshift(new VueINPUT());
      INPUT.vm.unshift(INPUT.newInput[0].$mount());
      INPUT.el.unshift(INPUT.vm[0].$el);
      INPUT.children.unshift(INPUT.newInput[0] && INPUT.newInput[0].$children && INPUT.newInput[0].$children[0]);
      document.body.appendChild(INPUT.el[0]);
    }

    function hidden() {
      INPUT.children[0].isShow = false;
      removeEl();
    }

    // 保证dom元素清除干净
    function removeEl() {
      const el = INPUT.el.pop();
      const newInput = INPUT.newInput.pop();
      INPUT.vm.pop();
      if (el === undefined) return;
      setTimeout(() => {
        document.body.removeChild(el);
        newInput.$destroy();
      }, animationSecond * 1000);
      removeEl();
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
