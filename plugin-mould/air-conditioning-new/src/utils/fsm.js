/**
 * @description 获取配置
 * @returns json配置
 */
export const getConfig = (param = {}) => {
  // 配置key
  const { key } = require('@/../plugin.id.json');
  // localconfig模式下强制启用本地配置
  const getLocalConfig = () => {
    const isLocalConfig = process.env.VUE_APP_MODE === 'local' || param.isLocal;
    return isLocalConfig && require(`@/../../../output/${key}.json`);
  };
  // 如果是development环境，获取线上配置
  const getServeConfig = () => {
    const isServeConfig = process.env.NODE_ENV === 'development';
    return isServeConfig ? param.storage.get('config') : require(`@/../../../output/${key}.json`);
  };
  // 本地模式下优先获取本地配置
  return getLocalConfig() || getServeConfig();
};

export const getState = result => {
  console.log(result);
};
