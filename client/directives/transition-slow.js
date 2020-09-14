import state from '@/store/module/pulic.js';

const transitionSlow = {
  bind: (el, bingding) => {
    if (!bingding.value) {
      el.$_display = el.style.display;
      el.style.display = 'none';
    }
  },
  update: (el, bingding) => {
    if (el.$_timer) return;
    const animationSecond = state.state.animationSecond;
    if (bingding.value) {
      if (el.$_display) {
        el.style.display = el.$_display;
        el.style.animation = `slowShow ${animationSecond}s infinite`;
        el.style['animation-iteration-count'] = '1';
      }
    } else {
      el.style.animation = `slowHide ${animationSecond}s infinite`;
      el.style['animation-iteration-count'] = '1';
      el.$_timer = setTimeout(() => {
        el.$_timer = undefined;
        el.$_display = el.style.display;
        el.style.display = 'none';
      }, animationSecond * 1000);
    }
  }
};

export default transitionSlow;
