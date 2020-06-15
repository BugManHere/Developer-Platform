module.exports = {
  home: {
    power: 'Power',
    powerOn: 'Power On',
    powerOff: 'Power Off',
    rotate: 'Swing',
    windSpeed: 'Wind Speed',
    windLevel: 'Wind Level',
    function: 'Function',
    voice: 'Voice',
    timing: 'Timing'
  },
  error: {
    notify_fault_title: 'notify',
    notify_Repaired: 'Repaired',
    notify_Not_Repaired: 'repaired',
    notify_repair_inquiries: 'Repair progress inquiries',
    notify_repair_book: 'Repair book',
    notify_fault_name: 'Fault name',
    notify_fault_type: 'Fault type',
    notify_fault_code: 'Fault code',
    notify_fault_remove: 'Release condition',
    notify_fault_reson: 'Fault reason',
    notify_fault_name_WiFi: 'WiFi communication failure',
    notify_fault_code_WiFi: '',
    notify_fault_resolve_WiFi:
      'After the fault is recovered, it will automatically exit. If it still exists for a long time, Please send it to the designated service point for repair',
    notify_fault_name_E1: 'System high pressure protection',
    notify_fault_name_E2: '防冻结保护',
    notify_fault_name_E3: 'Low pressure protection',
    notify_fault_name_E4: 'Compressor high discharge temperature protection',
    notify_fault_name_E5: 'Overcurrent protection',
    notify_fault_name_E6:
      'Communication error between indoor unit and outdoor unit',
    notify_fault_name_E7: 'Mode conflict',
    notify_fault_name_E8: 'High temperature protection',
    notify_fault_name_F1:
      'Open/short circuit of indoor ambient temperature sensor',
    notify_fault_name_F2:
      'Open/short circuit of indoor evaporator temperature sensor',
    notify_fault_name_F3:
      'Open/short circuit of outdoor ambient temperature sensor',
    notify_fault_name_F4:
      'Open/short circuit of outdoor condenser temperature sensor',
    notify_fault_name_F5:
      'Open/short circuit of outdoor discharge temperature sensor',
    notify_fault_name_F6: '过负荷限/降频',
    notify_fault_name_F8: '电流过大降频',
    notify_fault_name_F9: '排气过高降频',
    notify_fault_name_PH: 'Overhigh voltage of DC bus',
    notify_fault_name_U5: 'Complete unit current detection error',
    notify_fault_name_P5: 'Overcurrent protection of compressor phase current',
    notify_fault_name_L3: 'Outdoor DC fan error',
    notify_fault_name_Fo: '收氟模式',
    notify_fault_name_H3: 'Compressor overload protection',
    notify_fault_name_H4: 'System error',
    notify_fault_name_H5: 'IPM protection',
    notify_fault_name_HC: 'PFC protection',
    notify_fault_name_H7: 'Compressor non-synchronism',
    notify_fault_name_H0: '制热防高温降频',
    notify_fault_name_Lc: 'Startup failure',
    notify_fault_name_U1: 'Compressor phase current detection circuit error',
    notify_fault_name_EE: 'EEPROM read error',
    notify_fault_name_PU: 'Capacitor charging error',
    notify_fault_name_P7: 'Module temperature sensor circuit error',
    notify_fault_name_P8: 'High module temperature protection',
    notify_fault_name_U3: 'DC bus voltage dropping error',
    notify_fault_name_PL: 'Low DC bus voltage',
    notify_fault_name_LE: 'Compressor stalling',
    notify_fault_name_EU: '模块温度过高限/降频',
    notify_fault_name_U7: '4-way valve reversing error',
    notify_fault_name_En: '模块过电流限频/降频',
    notify_fault_name_FH: '防冻结限/降频',
    notify_fault_name_FC:
      'Sliding door error (only for the models with sliding door)',
    notify_fault_name_F0: 'Refrigerant lacking or valve cut-off protection',
    notify_fault_name_oE: '外机任意停机故障',
    notify_fault_name_e6: '室内主板与显示板通故障',
    notify_fault_name_H6: 'Indoor DC fan stalling protection',
    notify_fault_name_Uo: '外环温度异常',
    notify_Fault_name_C5: 'Jumper cap error',
    notify_Fault_name_U8: 'Indoor unit zero-cross signal error',
    notify_Fault_name_A2: 'Adhesion error of outdoor refrigerant heater relay',
    notify_Fault_name_A4: 'Refrigerant heater temperature sensor error',
    notify_Fault_name_A5: 'Condenser inlet pipe temperature sensor error',
    notify_Fault_name_A7: 'Condenser outlet pipe temperature sensor error',
    notify_Fault_name_JF:
      'Communication error between indoor unit and detection board',
    notify_Fault_name_rF: 'RF module error',
    notify_Fault_name_no: 'Matching error of inverter and non-inverter models',
    notify_Fault_name_Fc: 'Unit head lifting error',
    notify_Fault_name_J6:
      'Communication error between display board and drive board'
  },
  voice: {
    voiceAssistant: 'Voice Assistant',
    prompt: '提示',
    prompt_title: '你可以这样说：',
    prompt_power: '打开/关闭空调',
    prompt_tem: '温度设为16~30度',
    prompt_temud: '升高/调高/降低/调低1~14度',
    prompt_mod: '自动/送风/制热/制冷/除湿模式',
    prompt_wdspd: '静音/低/中低/中档/中高/高/强劲风',
    prompt_wdspdud: '增大/调高/加快/减小/调低/减慢风速',
    voice_cmd_not_found:
      'This command isn’t supported, please try another command.',
    voice_cmd_max_level: 'The gear level is already minimal.',
    voice_cmd_min_level: 'The gear level is already the largest.'
  },
  timer: {
    timing: 'Timing',
    complete: 'Complete',
    hour: 'Hour',
    minute: 'Min Later',
    later: 'Later',
    delete: 'Delete'
  },
  offline: {
    prompt: 'Offline',
    detail: 'See Details'
  },
  mode: {
    mode_cool: 'Cool',
    mode_auto: 'Auto',
    mode_heat: 'Heat',
    mode_fan: 'Fan',
    mode_dry: 'Dry',
    fan_turbo_auto_tips: "Can't set Turbo in Auto mode.",
    fan_turbo_fan_tips: "Can't set Turbo in Fan mode.",
    fan_quiet_auto_tips: "Can't set Quiet in Auto mode.",
    fan_quiet_fan_tips: "Can't set Quiet in Fan mode.",
    fan_dry_tips: 'Only set Low in Dry mode.'
  },
  fan: {
    fan_auto: 'Auto',
    fan_low: 'Low',
    fan_medium_low: 'Medium-Low',
    fan_medium: 'Medium',
    fan_medium_high: 'Medium-High',
    fan_high: 'High',
    fan_turbo: 'Turbo',
    fan_quiet: 'Quiet'
  },
  btn: {
    advance_updown: 'Up&Down',
    advance_leftright: 'Left&Right',
    advance_health: 'Health',
    advance_light: 'Light',
    advance_glare: 'Light',
    advance_sleep: 'Sleep',
    advance_ass_heating: 'Ass heating',
    advance_timer: 'Timer',
    advance_air: 'Air',
    blow_follow: 'follows',
    blow_beaway: 'avoids',
    noBodySave: 'Nobody',
    advance_vocCtlL: 'AC-Voice',
    advance_tempunit: 'Temp Unit',
    advance_humidification: 'humidification'
  },
  sweep: {
    speedTitle: 'Swing',
    advance_updown: 'Up&Down',
    advance_leftright: 'Left&Right',
    speedDownTitle:
      'Click to select fixed-angle swing and slide to select regional swing.',
    sweep_ud_tips: 'Do not support swing in this region.',
    sweep_ud_tips2: 'Up-Down swing only supports full angle swing.',
    sweep_ud_turnoff_tips: 'Up-Down sweep was closed.',
    sweep_lr_tips: 'Left&right swing only supports full angle swing.',
    sweep_lr_turnoff_tips: 'Left-Right sweep was closed.',
    sweep_powoff_tips:
      'Air conditioning has been shut down and this page will automatically exit.',
    sweep_txtlf: 'Left-Right sweep',
    sweep_txt2:
      'Click to select fixed-angle swing <br> and slide to select regional swing <br> and click other zone to cancle.'
  },
  air: {
    title: 'Fresh air',
    on: 'air on',
    off: 'air off',
    Intelligent: 'Intelligent air',
    air_powoff_tips:
      'Air conditioning has been shut down and this page will automatically exit.'
  },
  humidify: {
    title: 'Humidification Settings',
    continuation: '连续加湿',
    Intelligent: '智能加湿',
    fortyPercent: '加湿40%',
    fiftyPercent: '加湿50%',
    sixtyPercent: '加湿60%',
    seventyPercent: '加湿70%',
    humidify_powoff_tips:
      'Air conditioning has been shut down and this page will automatically exit.'
  }
};
