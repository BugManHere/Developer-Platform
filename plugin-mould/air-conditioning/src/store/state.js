const state = {
  mac: 'ef2ddc43a7ac', // 设备mac
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
    SetTem: 24,
    WdSpd: 1,
    'Add0.5': 0,
    'Add0.1': 0,
    has05: 1,
    has01: 0,
    ElcEn: 1, // 电量统计
    functype: 0, // 0代表正常，1代表集中控制
    CO2: 401,
    SmartSlpModEx: 0
  },
  checkObject: {},
  // deviceInfo中name可以修改，其他的请勿修改
  deviceInfo: {
    path: '', // 主体插件页面路径
    fullstatueJson: '', // config.xml里对应的查询字段
    deviceState: 2, // 设备在线状态，-1离线，2在线
    lang: 'zh_CN', // 语言
    name: '空调'
  },
  devOptions: {
    mid: '',
    statueJson: '[]',
    statueJson2: '[]',
    identifierArr: []
  },
  // 图标的数据缓存
  chartData: {
    total: 0, // 累计总用电量
    dayChart: null, // 两小时数据
    weekChart: null, // 每天
    monthChart: null, // 每月
    yearChart: null // 每年
  }
};
export default state;
