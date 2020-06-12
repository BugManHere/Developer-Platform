module.exports = {
  home: {
    power: '开关',
    powerOn: '已开机',
    powerOff: '已关机',
    rotate: '摇头',
    windSpeed: '风速',
    windLevel: '档',
    function: '功能',
    paintedScreen: '画时代',
    voice: '语音',
    smart: '智能',
    timing: '定时',
    CO2: '二氧化碳浓度',
    Electric: '电量查询',
  },
  ban: {
    Auto: '自动',
    StHt_C: '8',
    StHt_F: '46',
  },
  error: {
    notify_fault_title: '故障通知',
    notify_Repaired: '已报修',
    notify_Not_Repaired: '报修',
    notify_repair_inquiries: '报修进度查询',
    notify_repair_book: '报修预约',
    notify_fault_name: '故障名称',
    notify_fault_type: '故障类型',
    notify_fault_code: '故障代码',
    notify_fault_remove: '解除条件',
    notify_fault_reson: '故障原因',
    notify_fault_name_WiFi: 'WiFi通讯异常',
    notify_fault_code_WiFi: '',
    notify_fault_resolve_WiFi:
      '故障恢复后自动退出, 若长时间不退出, 重新上电仍出现, 请送指定维修点维修',
    notify_fault_name_E1: '系统高压保护',
    notify_fault_name_E2: '防冻结保护',
    notify_fault_name_E3: '低压保护',
    notify_fault_name_E4: '压缩机排气高温保护',
    notify_fault_name_E5: '过流保护',
    notify_fault_name_E6: '内机通讯故障',
    notify_fault_name_E7: '模式冲突',
    notify_fault_name_E8: '防高温保护',
    notify_fault_name_F1: '室内环境感温包开、短路',
    notify_fault_name_F2: '室内蒸发器感温包开、短路',
    notify_fault_name_F3: '室外环境感温包开、短路',
    notify_fault_name_F4: '室外冷凝器感温包开、短路',
    notify_fault_name_F5: '室外排气扇感温包开、短路',
    notify_fault_name_F6: '过负荷限/降频',
    notify_fault_name_F8: '电流过大降频',
    notify_fault_name_F9: '排气过高降频',
    notify_fault_name_PH: '直流母线电压过高',
    notify_fault_name_U5: '整机电流检测故障',
    notify_fault_name_P5: '压缩机相电流过流保护',
    notify_fault_name_L3: '外机直流风机故障',
    notify_fault_name_Fo: '收氟模式',
    notify_fault_name_H3: '压缩机过载保护',
    notify_fault_name_H4: '系统异常',
    notify_fault_name_H5: 'IPM保护',
    notify_fault_name_HC: 'PFC保护',
    notify_fault_name_H7: '压缩机失步',
    notify_fault_name_H0: '制热防高温降频',
    notify_fault_name_Lc: '启动失败',
    notify_fault_name_U1: '压缩机相电流检测电路故障',
    notify_fault_name_EE: '读EEPROM故障',
    notify_fault_name_PU: '电容充电故障',
    notify_fault_name_P7: '模块感温包电路故障',
    notify_fault_name_P8: '模块温度过高保护',
    notify_fault_name_U3: '直流母线电压跌落故障',
    notify_fault_name_PL: '直流母线电压过低',
    notify_fault_name_LE: '压缩机堵转',
    notify_fault_name_EU: '模块温度过高限/降频',
    notify_fault_name_U7: '四通阀换向异常',
    notify_fault_name_En: '模块过电流限频/降频',
    notify_fault_name_FH: '防冻结限/降频',
    notify_fault_name_FC: '左右扫风堵转保护',
    notify_fault_name_F0: '缺氟或阀门截止保护',
    notify_fault_name_oE: '外机任意停机故障',
    notify_fault_name_e6: '室内主板与显示板通故障',
    notify_fault_name_H6: '直流风机故障',
    notify_fault_name_Uo: '外环温度异常',
    notify_Fault_name_C5: '跳线帽故障',
    notify_Fault_name_U8: '内机过零信号故障',
    notify_Fault_name_A2: '室外机冷媒加热器继电器粘连故障',
    notify_Fault_name_A4: '冷媒加热器温度感温包故障',
    notify_Fault_name_A5: '冷凝器入管感温包故障',
    notify_Fault_name_A7: '冷凝器出管感温包故障',
    notify_Fault_name_JF: '内机与检测板通讯故障',
    notify_Fault_name_rF: '射频模块故障',
    notify_Fault_name_no: '定变频搭配错误故障',
    notify_Fault_name_Fc: '头部升降故障',
    notify_Fault_name_J6: '显示板与驱动板通讯故障'
  },
  warn: {
    dirty: '过滤网已脏堵，请注意定期清洗！'
  },
  voice: {
    voiceAssistant: '语音助手',
    prompt: '提示',
    prompt_title: '你可以这样说：',
    prompt_power: '打开/关闭空调',
    prompt_tem: '温度设为16~30度',
    prompt_temud: '升高/调高/降低/调低1~14度',
    prompt_mod: '自动/送风/制热/制冷/除湿模式',
    prompt_wdspd: '静音/低/中低/中档/中高/高/强劲风',
    prompt_wdspdud: '增大/调高/加快/减小/调低/减慢风速',
    voice_cmd_not_found: '该口令暂时未开放，请尝试其它指令。',
    voice_cmd_max_level: '已经是最大档位。',
    voice_cmd_min_level: '已经是最小档位。'
  },
  timer: {
    timing: '定时',
    complete: '完成',
    hour: '小时',
    minute: '分钟后',
    later: '后',
    delete: '删除'
  },
  offline: {
    prompt: '连接已断开，',
    detail: '查看详情'
  },
  mode: {
    cool: '制冷',
    auto: '自动',
    heat: '制热',
    fan: '送风',
    dry: '除湿',
    fan_turbo_auto_tips: '自动模式下不能设置强劲风。',
    fan_turbo_fan_tips: '送风模式下不能设置强劲风。',
    fan_quiet_auto_tips: '自动模式下不能设置静音。',
    fan_quiet_fan_tips: '送风模式下不能设置静音。',
    fan_dry_tips: '除湿模式下不可调节风速。'
  },
  fan: {
    auto: '自动风',
    low: '低风档',
    medium_low: '中低风档',
    medium: '中风档',
    medium_high: '中高风档',
    high: '高风档',
    turbo: '强劲档',
    quiet: '静音档'
  },
  btn: {
    Sleep: '睡眠',
    SmartSleep: '智眠',
    BabySleep: '智眠',
    SwingUD: '上下扫风',
    SwingLR: '左右扫风',
    Health: '健康',
    AutoLig: '自动灯光',
    Lig: '灯光',
    'Lig(Auto)': '灯光',
    StHt: '8℃制热',
    VocCtl: '空调语音',
    UnmanedShutDown: '无人节能',
    SmartWind: '智能送风',
    Dazzling: '炫光',
    AssHt: '辅热',
    'AssHt(Auto)': '辅热',
    'AssHt(Reverse)': '辅热',
    'AssHt(M3)': '辅热',
    cwz: '陈文中',
    TemStep: '温度间隔',
    TemUn: '温度单位',
    AppTimer: '预约',
    FanLR: '双侧出风',
    FanLR_左侧: '左侧出风',
    FanLR_右侧: '右侧出风',
    Follow: '风随',
    Avoid: '风避',
    Air: '新风',
    Air_智能: '智能新风',
    NobodySave: '无人节能',
    FbidBloPer: '防直吹',
    UDFanPort: '下出风',
    'UDFanPort(Auto)': '下出风',
    AntiDirectBlow: '防直吹',
    // 商用
    OutHome: '外出模式',
    LoopMod: '循环风',
    LoopMod_混合风: '混合风',
    LoopMod_全新风: '全新风',
    SvSt: '节能',
    Blo: '干燥',
    Humi: '除湿',
    x: '再热除湿',
  },
  sweep: {
    speedTitle: '扫风',
    advance_updown: '上下扫风',
    advance_leftright: '左右扫风',
    speedDownTitle: '点击选择定格扫，滑动选择区域扫',
    sweep_ud_tips: '不支持此区域扫风。',
    sweep_ud_tips2: '上下扫风只支持定格扫和全扫。',
    sweep_ud_turnoff_tips: '上下扫风已关闭。',
    sweep_lr_tips: '左右扫风只支持定格扫和全扫。',
    sweep_lr_turnoff_tips: '左右扫风已关闭。',
    sweep_powoff_tips: '空调已被关闭，自动退出扫风设置。',
    Stage_tips: '提示:',
    sweep_txt2:
      '1.点击扫风位置，可精确定格扫风。<br> 2.滑动整个区域，可区域扫风。<br> 3.点击空白处可取消扫风设置。'
  },
  air: {
    title: '新风',
    on: '新风开',
    off: '新风关',
    Intelligent: '智能新风',
    air_powoff_tips: '空调已被关闭，自动退出新风设置。'
  },
  humidify: {
    title: '加湿设置',
    continuation: '连续加湿',
    Intelligent: '智能加湿',
    fortyPercent: '加湿40%',
    fiftyPercent: '加湿50%',
    sixtyPercent: '加湿60%',
    seventyPercent: '加湿70%',
    humidify_powoff_tips: '空调已被关闭，自动退出加湿设置。'
  },
  cube: {
    electric: '当前电量',
    scene: '参数设置',
    btn_lock: '童锁',
    sleep_side: '睡眠模式',
    study_side: '学习模式',
    diy_side: '自定义模式',
  },
  setting: {
    save: '保存',
    parameter: '当前参数',
    parameter_setting: '参数设置',
    mode_cool: '制冷',
    mode_auto: '自动',
    mode_heat: '制热',
    mode_fan: '送风',
    mode_dry: '除湿',
    mode: '模式',
    tem: '温度',
    wind: '风速',
    advance_updown: '上下扫风',
    advance_leftright: '左右扫风',
    fan_auto: '自动风',
    fan_low: '低风',
    fan_medium_low: '中低风',
    fan_medium: '中风',
    fan_medium_high: '中高风',
    fan_high: '高风',
    fan_turbo: '强劲风',
    fan_quiet: '静音风',
    sweep: '扫风',
    sweepOff: '关',
    sweepOn: '开',
    sweepLeft: '左',
    sweepRight: '右',
    sweepLr: '左右',
    sweepUp: '上',
    sweepDown: '下',
    sweepUd: '上下',
    recovery: '恢复出厂设置',
  }
};
