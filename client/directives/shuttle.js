const animationSecond = 0.5;

const shuttle = {
  bind: (el, bingding) => {
    el.dataset.shuttleTimer = 'false'; // 定时器
    el.dataset.shuttleDisplay = 'false'; // 是否显示
    if (!bingding.value) {
      el.dataset.shuttleDisplay = el.style.display;
      el.style.display = 'none';
    }
  },
  update: (el, bingding) => {
    if (bingding.value === bingding.oldValue || el.dataset.shuttleTimer !== 'false') return;
    if (bingding.value) {
      if (el.dataset.shuttleDisplay !== 'false') {
        clearTimeout(el.dataset.shuttleTimer);
        el.style.display = el.dataset.shuttleDisplay;
        el.style.animation = `shuttleShow ${animationSecond}s infinite`;
        el.style['animation-iteration-count'] = '1';
      }
    } else {
      clearTimeout(el.dataset.shuttleTimer);
      el.dataset.shuttleTimer = setTimeout(() => {
        el.dataset.shuttleTimer = 'false';
        el.dataset.shuttleDisplay = el.style.display;
        el.style.display = 'none';
      }, animationSecond * 900);
      el.style.animation = `shuttleHide ${animationSecond}s infinite`;
      el.style['animation-iteration-count'] = '1';
    }
  }
};

export default shuttle;
