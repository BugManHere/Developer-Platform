const animationSecond = 0.5;

const fade = {
  inserted: (el, bingding) => {
    el.dataset.fadeTimer = 'false'; // 定时器
    el.dataset.fadeDisplay = 'false'; // 是否显示
    if (!bingding.value) {
      el.dataset.fadeDisplay = el.style.display;
      el.style.display = 'none';
    }
  },
  update: (el, bingding) => {
    if (bingding.value === bingding.oldValue || el.dataset.fadeTimer !== 'false') return;
    if (bingding.value) {
      if (el.dataset.fadeDisplay !== 'false') {
        clearTimeout(el.dataset.fadeTimer);
        el.style.display = el.dataset.fadeDisplay;
        el.style.animation = `fadeShow ${animationSecond}s infinite`;
        el.style['animation-iteration-count'] = '1';
      }
    } else {
      clearTimeout(el.dataset.fadeTimer);
      el.dataset.fadeTimer = setTimeout(() => {
        el.dataset.fadeTimer = 'false';
        el.dataset.fadeDisplay = el.style.display;
        el.style.display = 'none';
      }, animationSecond * 900);

      el.style.animation = `fadeHide ${animationSecond}s infinite`;
      el.style['animation-iteration-count'] = '1';
    }
  }
};

export default fade;
