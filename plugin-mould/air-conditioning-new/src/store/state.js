const state = {
  mac: '', // 设备mac
  functype: 0, // 0代表正常，1代表集中控制
  isScene: 0, // 是否是场景模式
  ModHeat: 4, // 制热模式
  watchLock: true,
  autoAbleSetTem: false,
  swiperHold: false,
  ableSend: false, // 是否允许发送命令
  loading: false,
  isStHt: false,
  dataObject: {
    Pow: 1,
    Mod: 1,
    WdSpd: 5
  },
  checkObject: {},
  // deviceInfo中name可以修改，其他的请勿修改
  deviceInfo: {
    path: '', // 主体插件页面路径
    fullstatueJson: '', // config.xml里对应的查询字段
    deviceState: 2, // 设备在线状态，-1离线，2在线
    lang: 'zh_CN', // 语言
    name: 'RGB盒子'
  },
  devOptions: {
    mid: '',
    statueJson: '[]',
    statueJson2: '[]',
    identifierArr: []
  }
};

export default state;
