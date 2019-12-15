import Toast from './Toast.vue'

const TOAST = {
  duration: 3000, // 显示的时间 ms
  animateTime: 1000,
  install(Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue;
    }
    Vue.component('Toast', Toast);

    function msg(type, text, callBack) {
      let msg;
      let duration = TOAST.duration;
      if (typeof text === 'string') {
        msg = text;
      } else if (text instanceof Object) {
        msg = text.text || '';
        if (text.duration) {
          duration = text.duration;
        }
      }
      const VueToast = Vue.extend({
        render(h) {
          let props = {
            type,
            text: msg,
            show: this.show
          };
          return h('Toast', {props});
        },
        data() {
          return {
            show: false
          }
        },
      })
      let newToast = new VueToast();
      let vm = newToast.$mount();
      let el = vm.$el;
      document.body.appendChild(el);
      vm.show = true;
      let t1 = setTimeout(() => {
        clearTimeout(t1)
        vm.show = false;  //隐藏提示组件，此时会有300ms的动画效果，等动画效果过了再从body中移除dom
        let t2 = setTimeout(() => {
          clearTimeout(t2);
          document.body.removeChild(el); //从body中移除dom
          newToast.$destroy();
          vm = null; // 设置为null，好让js垃圾回收算法回收，释放内存

          callBack && (typeof callBack === 'function') && callBack() 
        }, TOAST.animateTime)
      }, duration)
    }

    Vue.prototype.$toast = {
      info(text, callBack) {
        if (!text) return;
        msg('info', text, callBack);
      },
      warning(text, callBack) {
        if (!text) return;
        msg('warning', text, callBack);
      },
      message(text, callBack) {
        if (!text) return;
        msg('message', text, callBack);
      },
      error(text, callBack) {
        if (!text) return;
        msg('error', text, callBack);
      },
    }
  }
}

export default TOAST;