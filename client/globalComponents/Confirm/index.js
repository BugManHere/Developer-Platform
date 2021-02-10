import Confirm from './index.vue';
const animationSecond = 0.5;

const CONFIRM = {
  newConfirm: [],
  vm: [],
  el: [],
  children: [],
  install(Vue) {
    Vue.component('Confirm', Confirm);

    function display(map) {
      const VueCONFIRM = Vue.extend({
        render(h) {
          let props = map;
          return h('Confirm', { props });
        }
      });
      CONFIRM.newConfirm.unshift(new VueCONFIRM());
      CONFIRM.vm.unshift(CONFIRM.newConfirm[0].$mount());
      CONFIRM.el.unshift(CONFIRM.vm[0].$el);
      CONFIRM.children.unshift(CONFIRM.newConfirm[0] && CONFIRM.newConfirm[0].$children && CONFIRM.newConfirm[0].$children[0]);
      document.body.appendChild(CONFIRM.el[0]);
    }

    function hidden() {
      CONFIRM.children[0].isShow = false;
      removeEl();
    }

    // 递进数组保证dom元素清除干净
    function removeEl() {
      const el = CONFIRM.el.pop();
      const newConfirm = CONFIRM.newConfirm.pop();
      CONFIRM.vm.pop();
      if (el === undefined) return;
      setTimeout(() => {
        document.body.removeChild(el);
        newConfirm.$destroy();
      }, animationSecond * 1000);
      removeEl();
    }

    Vue.prototype.$confirm = {
      show(map) {
        display(map);
      },
      hide() {
        hidden();
      }
    };
  }
};

export default CONFIRM;
