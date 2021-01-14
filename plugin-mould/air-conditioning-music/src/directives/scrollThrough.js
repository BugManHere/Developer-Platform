// 滑动穿透
const scrollThroughEvent = {
  // bind(el) {
  //   el.addEventListener('touchstart', e => {
  //     const target = document.getElementsByClassName('page-content')[0];
  //     el.dataset.startY = e.touches[0].clientY;
  //     el.dataset.contentDom = target;
  //     el.dataset.elTop = el.scrollTop;
  //     el.dataset.top = target.scrollTop;
  //   });
  //   el.addEventListener('touchmove', e => {
  //     const target = document.getElementsByClassName('page-content')[0];
  //     const temContent = document.getElementsByClassName('tem-edit')[0];
  //     const { clientHeight: temContentHeight } = temContent;
  //     const clientY = e.touches[0].clientY;
  //     const distance = clientY - el.dataset.startY;
  //     el.dataset.startY = clientY;
  //     const { scrollTop } = target;
  //     // 向下滑动时
  //     if (distance > 0 && scrollTop > 0 && !el.scrollTop) {
  //       const toScrollTop = Number(scrollTop) - distance;
  //       target.scrollTo(0, toScrollTop > 0 ? toScrollTop : 0);
  //     } else if (distance < 0 && scrollTop < temContentHeight) {
  //       e.preventDefault();
  //       const toScrollTop = Number(scrollTop) - distance;
  //       target.scrollTo(0, toScrollTop > 0 ? toScrollTop : 0);
  //     } else {
  //       return true;
  //     }
  //   });
  // }
};

export default scrollThroughEvent;
