const state = {
  mac: '123456', // 设备mac
  ModHeat: 4, // 制热模式
  watchLock: true,
  autoAbleSetTem: false,
  swiperHold: false,
  ableSend: false, // 是否允许发送命令
  loading: false,
  hasAir: JSON.parse(process.env.VUE_APP_JSON).includes('Air'),
  dataObject: {
    Pow: 1,
    Mod: 2,
    SetTem: 24,
    WdSpd: 3,
    'Add0.5': 0,
    'Add0.1': 0,
    Lig: 1,
    LigSen: 1,
    has05: 1,
    has01: 0,
    functype: 0, // 0代表正常，1代表集中控制
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
