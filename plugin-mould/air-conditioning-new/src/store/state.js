const state = {
  mac: '', // 设备mac
  isScene: 0, // 是否是场景模式
  ModHeat: 4, // 制热模式
  watchLock: true, // 互斥锁
  ableSend: false, // 是否允许发送命令
  fanKey: 'Fan',
  modKey: 'Mod',
  dataObject: {
    functype: 0, // 0代表正常，1代表集中控制
    Pow: 1,
    Mod: 1,
    SetTem: 25,
    WdSpd: 5,
    Quiet: 0,
    Tur: 0
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
