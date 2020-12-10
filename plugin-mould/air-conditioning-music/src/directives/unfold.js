const animationTime = 0.5;

// 展开收起
const unfoldEvent = {
  bind: async (el, binding) => {
    // 确保拿到高度
    const contentHeight = await getElHeight(el);
    //  保存初始高度
    el.dataset.contentHeight = contentHeight;
    // 增加动画
    el.style.transition = `all ${animationTime}s`;
    // 设置高度
    setElHeight(el, binding.value ? contentHeight : 0);
  },
  update: (el, binding) => {
    if (binding.value !== binding.oldValue) {
      // 更新高度
      setElHeight(el, binding.value ? el.dataset.contentHeight : 0);
    }
  }
};

// 确保获取元素高度
function getElHeight(el) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const contentHeight = el.clientHeight;
        if (contentHeight) {
          resolve(contentHeight);
        } else {
          getElHeight(el).then(res => {
            resolve(res);
          });
        }
      }, 20);
    } catch (e) {
      reject(e);
    }
  });
}

// 更改元素高度
function setElHeight(el, height) {
  el.style.height = `${height}px`;
}

export default unfoldEvent;
