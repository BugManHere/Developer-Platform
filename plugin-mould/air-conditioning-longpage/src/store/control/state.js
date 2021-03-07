export default {
  mac: '', // 设备mac
  mainMac: '', // 设备主mac
  hiddenComponent: '',
  watchLock: true, // 互斥锁
  ableSend: false, // 是否允许发送命令
  dataObject: {
    vender: '', // 细分码
    functype: 0, // 0代表正常，1代表集中控制
    Pow: 1,
    SetTem: 25,
    WdSpd: 5,
    Tur: 0,
    Quiet: 0,
    ErrType1: 0,
    ErrType2: 0,
    MainPopupType: ''
  },
  checkObject: {},
  // deviceInfo中name可以修改，其他的请勿修改
  deviceInfo: {
    path: '', // 主体插件页面路径
    fullstatueJson: '', // config.xml里对应的查询字段
    deviceState: 2, // 设备在线状态，-1离线，2在线
    lang: 'zh_CN', // 语言
    name: '分体机'
  },
  popup: {},
  devOptions: {
    mid: '',
    statueJson: '[]',
    statueJson2: '[]',
    identifierArr: []
  }
};
