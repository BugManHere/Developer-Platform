const tempModule = {
  templates: [], // 模板列表
  tempID: false, // 模板id
  productID: false, // 模板id对应的productID
  seriesID: false, // 模板id对应的seriesID
  currentStatusId: false,
  currentStatusList: [], // 当前功能下的状态列表
  excludeMap: {},
  hideMap: {}
};
export default { state: tempModule };
