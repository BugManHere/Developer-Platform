export default {
  baseData: {
    deviceName: undefined, // 设备名称
    excludeMap: {}, // 排斥关系
    funcDefine: [], // models
    typeDefine: [],
    jsonDefine: [],
    midTypeFunc: {}, // 细分码对应的models
    hideMap: {}, // 隐藏关系
    moreOption: {}, // 更多配置项
    productModel: '' // 模板id
  },
  deriveData: {
    hideStateNameJson: '[]', // 被隐藏的state
    outputMap: {}
  },
  devOptions: {
    mid: '',
    statueJson: '[]',
    statueJson2: '[]',
    identifierArr: []
  }
};
