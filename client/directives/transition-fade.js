import state from '@/store/pulicModule/state.js'

const transitionFade = {
  bind: (el, bingding) => {
    if (!bingding.value) {
      el.style.display = 'none';
    }
  },
  update: (el, bingding) => {
    if (el.$_timer) return;
    const animationSecond = state.animationSecond;
    if (bingding.value) {
      el.style.display = 'block';
      el.style.animation = `slowshow ${animationSecond}s infinite`;
      el.style['animation-iteration-count'] = '1';
    } else {
      el.style.animation = `slowhide ${animationSecond}s infinite`;
      el.style['animation-iteration-count'] = '1';
      el.$_timer = setTimeout(() => {
        el.$_timer = undefined;
        el.style.display = 'none';
      }, animationSecond * 1000);
    }
  },
};

export default transitionFade;