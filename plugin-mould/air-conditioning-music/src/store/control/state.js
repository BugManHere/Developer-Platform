const state = {
  mac: 'test', // 设备mac
  skinIndex: 0, // 皮肤编号
  selectKey: 'grown-card',
  watchLock: true, // 互斥锁
  ableSend: false, // 是否允许发送命令
  isCeiling: false,
  dataObject: {
    functype: 0, // 0代表正常，1代表集中控制
    Pow: 1,
    Mod: 1,
    'Add0.1': 8,
    'Add0.5': 1,
    has01: 1,
    has05: 1,
    SetTem: 25,
    WdSpd: 5,
    Quiet: 0,
    Tur: 0,
    // 睡眠测试数据
    Slp1H1: 1,
    Slp1L1: 4,
    Slp1H2: 1,
    Slp1L2: 14,
    Slp1H3: 1,
    Slp1L3: 24,
    Slp1H4: 1,
    Slp1L4: 24,
    Slp1H5: 1,
    Slp1L5: 24,
    Slp1H6: 1,
    Slp1L6: 24,
    Slp1H7: 1,
    Slp1L7: 4,
    Slp1H8: 1,
    Slp1L8: 4
  },
  checkObject: {},
  // deviceInfo中name可以修改，其他的请勿修改
  deviceInfo: {
    path: '', // 主体插件页面路径
    fullstatueJson: '', // config.xml里对应的查询字段
    deviceState: 2, // 设备在线状态，-1离线，2在线
    lang: 'zh_CN', // 语言
    name: 'Default'
  },
  devOptions: {
    mid: '',
    statueJson: '[]',
    statueJson2: '[]',
    identifierArr: []
  },
  musicData: {
    authDialog: 2, // 授权弹框 0不弹框 1弹框 2待确定
    authReasult: 0, // 0未授权 1授权云小微 2授权云小微与音乐
    imshowType: 0, // 0点播 1技能
    // 分组、分类
    groups: [], // 分组
    groupsUnfold: [], // 分组的展开
    groupId: '', // 分组id
    categoryId: '', // 分类id
    // 歌单
    playlistId: '', // 歌单ID
    playMap: {}, // 根据playlistId对playlist进行分类 {playlistId: playlists}
    // 歌曲
    listSongsMap: {}, // 根据playlistId对playlist进行分类 {playlistId: playlists}
    songInfosMap: {}, // 歌曲信息
    songId: '', // 播放中的歌曲id
    songUrl: {}, // 歌曲资源
    // 歌词
    lyric: '', // 歌词
    lyricMap: {}, // 歌词
    // 其他
    albumImg: '', // 专辑封面
    showBall: false, // 是否显示悬浮框
    musicPlaying: false // 歌曲播放中
  }
};

export default state;
