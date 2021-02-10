import Top from './index.vue';
import Vue from 'vue';

const TOP = {
  newTop: null,
  vm: null,
  el: null,
  install() {
    // display();

    Vue.prototype.$goTop = {
      show() {
        display();
      },
      hide() {
        hidden();
      }
    };
  },
  bind: el => {
    setTimeout(() => {
      el;
      // display(el);
    }, 0);
  },
  unbind: el => {
    hidden(el);
  }
};

function display(bindEl = document.body) {
  // console.log('display-------------', bindEl);
  TOP.vm && hidden();
  Vue.component('Top', Top);
  const VueTop = Vue.extend({
    render(h) {
      return h('Top');
    }
  });
  TOP.newTop = new VueTop();
  TOP.vm = TOP.newTop.$mount();
  TOP.el = TOP.vm.$el;
  bindEl.appendChild(TOP.el);
}

function hidden(bindEl = document.body) {
  // console.log('hidden-------------', bindEl);
  if (!TOP.vm) return;
  bindEl.removeChild(TOP.el);
  TOP.newTop.$destroy();
  TOP.vm = null;
}

export default TOP;
