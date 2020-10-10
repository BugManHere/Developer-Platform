const { key } = require('@/../plugin.id.json'); // 配置key
// funcDefine: 功能定义, excludeMap: 排斥关系, hideMap: 隐藏关系, moreOption: 更多配置项, productModel: mid, deviceName: 设备名称
const { funcDefine: g_funcDefine, excludeMap, hideMap, moreOption, productModel, deviceName } =
  process.env.NODE_ENV === 'development' ? window.storage.get('config') : require(`@/../../../output/${key}.json`); // 获取配置

export const funcDefine = g_funcDefine.map(module => {
  const statusDefine = {};
  // 将字符串转为数字
  Object.keys(module.statusDefine).forEach(statusName => {
    statusDefine[statusName] = module.statusDefine[statusName];
    statusDefine[statusName].value = Number(statusDefine[statusName].value);
    if (module.statusDefine[statusName].moreCommand) {
      Object.keys(module.statusDefine[statusName].moreCommand).forEach(json => {
        statusDefine[statusName].moreCommand[json] = Number(statusDefine[statusName].moreCommand[json]);
      });
    }
  });
  module.statusDefine = statusDefine;
  return module;
}); // 功能定义

// excludeMap: 排斥关系, hideMap: 隐藏关系, moreOption: 更多配置项, productModel: mid, deviceName: 设备名称
export { excludeMap, hideMap, moreOption, productModel, deviceName };
