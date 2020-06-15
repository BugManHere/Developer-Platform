const pulicModule = {
  productTypeList: [], // 产品列表
  animationSecond: .5, // 动画时间
  developType: 0, // 0：产品开发，1：模板开发
  delStatusType: false, // 删除状态
  setTempStep: 0, // 模板定义设置步骤
  setDevStep: 0, // 设备管理设置步骤
  statusSetStep: 0, // 状态定义步骤
  selectPanel: false, // 互斥表选择横轴或纵轴
  selectLabel: { // 互斥表选择的标签
    col: [],
    row: []
  },
};
export default {state: pulicModule};