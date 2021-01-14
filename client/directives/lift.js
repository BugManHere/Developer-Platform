const animationSecond = 0.5;

const lift = {
  bind: (el, bingding) => {
    el.dataset.liftTimer = 'false'; // 定时器
    el.dataset.liftDisplay = 'false'; // 是否显示
    if (!bingding.value) {
      el.dataset.liftDisplay = el.style.display;
      el.style.display = 'none';
    }
  },
  update: (el, bingding) => {
    if (bingding.value === bingding.oldValue || el.dataset.liftTimer !== 'false') return;
    if (bingding.value) {
      if (el.dataset.liftDisplay !== 'false') {
        clearTimeout(el.dataset.liftTimer);
        el.style.display = el.dataset.liftDisplay;
        el.style.animation = `fadeShow ${animationSecond}s infinite`;
        el.style['animation-iteration-count'] = '1';
      }
    } else {
      clearTimeout(el.dataset.liftTimer);
      el.dataset.liftTimer = setTimeout(() => {
        el.dataset.liftTimer = 'false';
        el.dataset.liftDisplay = el.style.display;
        el.style.display = 'none';
      }, animationSecond * 900);

      el.style.animation = `fadeHide ${animationSecond}s infinite`;
      el.style['animation-iteration-count'] = '1';
    }
  }
};

export default lift;
