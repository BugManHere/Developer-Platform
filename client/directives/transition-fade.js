import state from '@/store/module/pulic';

const transitionFade = {
  bind: (el, bingding) => {
    if (!bingding.value) {
      el.style.display = 'none';
    }
  },
  update: (el, bingding) => {
    if (el.$_timer) return;
    const animationSecond = state.state.animationSecond;
    if (bingding.value) {
      el.style.display = 'block';
      el.style.animation = `fadeShow ${animationSecond}s infinite`;
      el.style['animation-iteration-count'] = '1';
    } else if (el.style.display !== 'none') {
      el.style.animation = `fadeHide ${animationSecond}s infinite`;
      el.style['animation-iteration-count'] = '1';
      el.$_timer = setTimeout(() => {
        el.$_timer = undefined;
        el.style.display = 'none';
      }, animationSecond * 1000);
    }
  }
};

export default transitionFade;
