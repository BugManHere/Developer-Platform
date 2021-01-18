const focus = {
  update(el, bingding) {
    if (!bingding.value) return;
    console.log(el);
    el.focus();
    try {
      const range = window.getSelection(); // 获取光标
      range.selectAllChildren(el); // 选择所有文本
      range.collapseToEnd(); // 将光标移动到文本最后
    } catch (e) {
      e;
    }
  }
};

export default focus;
