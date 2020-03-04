const state = {
  mac: '', // 设备mac
  ModHeat: 4, // 制热模式
  watchLock: true,
  autoAbleSetTem: false,
  swiperHold: false,
  dataObject: {
    Pow: 1,
    Mod: 2,
    SetTem: 17,
    WdSpd: 4,
    'Add0.5': 1,
    'Add0.1': 6,
    Lig: 1,
    LigSen: 1,
    has05: 0,
    has01: 1,
    functype: 1, // 0代表正常，1代表集中控制
  },
  checkObject: {},
  // deviceInfo中name可以修改，其他的请勿修改
  deviceInfo: {
    path: '', // 主体插件页面路径
    fullstatueJson: '', // config.xml里对应的查询字段
    deviceState: 2, // 设备在线状态，-1离线，2在线
    lang: 'zh_CN', // 语言
    name: '空调'
  }
};
export default state;
