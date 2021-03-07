/* 当前元素高度设置与指定元素高度同步 */

export default {
  inserted: (el, binding) => {
    el.style.transition = 'height 0.1s';
    el.style.overflow = 'hidden';
    main(el, binding);
  },
  update: (el, binding) => {
    main(el, binding);
  }
};

function main(el, binding) {
  const { arg: targetElId } = binding;
  const targetEl = el.getElementsByClassName(targetElId)[0];
  targetEl &&
    setTimeout(() => {
      fixHeight(el, targetEl);
    }, 0);
}

function fixHeight(toEl, fromEl) {
  const { height } = window.getComputedStyle(fromEl);
  toEl.style.height = height;
}
