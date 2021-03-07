/* 将指定元素滚动到当前元素高度的位置 */

const timer = {};
const step = 1000 / 60; // 采用标准60hz屏幕刷新率

export default {
  componentUpdated: (el, binding) => {
    const { arg: targetElId } = binding;
    if (timer[targetElId]) return;
    const targetEl = document.getElementsByClassName(targetElId)[0];

    targetEl &&
      (timer[targetElId] = setTimeout(() => {
        fixScroll(targetEl, el);
        timer[targetElId] = null;
      }, step));
  }
};

function fixScroll(targetEl, fromEl) {
  const { scrollTop: currentTop } = targetEl;
  const { clientHeight } = fromEl;
  const distance = clientHeight - currentTop;

  slowScroll.call(targetEl, [currentTop, distance]);
  return true;
}

// 实现缓慢滚动
function slowScroll([currentTop, diatance]) {
  if (Math.abs(diatance) < 10) {
    this.scrollTo(0, currentTop + diatance);
    return;
  }
  const diff = diatance / 6;

  this.scrollTo(0, currentTop + diff);
  setTimeout(() => {
    slowScroll.call(this, [currentTop + diff, diatance - diff]);
  }, step);
}
