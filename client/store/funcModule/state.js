const state = {
  productID: false, // 产品id
  deviceKey: false, // 设备标识符
  currentFuncId: false,
  currentStatusId: false,
  devSetStep: 3,
  delStatusType: false,
  statusSetStep: 0,
  currentStatusList: [], // 当前功能下的状态列表
  activeStatusList: null, // 活跃的状态列表
  selectPanel: false,
  labelList: [],
  selectLabel: {
    col: [],
    row: []
  },
  funcDefineList: {},
  excludeMap: {},
  hideMap: {},
  disableMap: {},
};
export default state;