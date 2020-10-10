const state = {
  mac: '', // 设备mac
  watchLock: true, // 互斥锁
  ableSend: false, // 是否允许发送命令
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
    name: 'Default'
  },
  devOptions: {
    mid: '',
    statueJson: '[]',
    statueJson2: '[]',
    identifierArr: []
  },
  musicData: {
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
