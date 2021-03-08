const pulicModule = {
  productTypeList: [], // 产品列表
  animationSecond: 0.5, // 动画时间
  developType: 0, // 0：产品开发，1：模板开发
  setTempStep: 0, // 模板定义设置步骤
  selectLabel: {
    // 互斥表选择的标签
    col: [],
    row: []
  }
};
export default { state: pulicModule };
