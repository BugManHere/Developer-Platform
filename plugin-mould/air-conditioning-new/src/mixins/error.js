export const errorCode = {
  C0: {
    title: '内外机、内机线控器通讯故障',
    controlAble: false
  },
  d1: {
    title: '室内电路板不良',
    controlAble: false
  },
  d3: {
    title: '环境温度传感器故障',
    controlAble: false
  },
  d4: {
    title: '入管温度传感器故障',
    controlAble: false
  },
  d6: {
    title: '出管温度传感器故障',
    controlAble: false
  },
  d7: {
    title: '湿度传感器故障',
    controlAble: false
  },
  d9: {
    title: '跳线帽故障',
    controlAble: false
  },
  dC: {
    title: '容量拨码设置异常',
    controlAble: false
  },
  L1: {
    title: '内风机保护',
    controlAble: false
  },
  L3: {
    title: '水满保护',
    controlAble: false
  },
  L7: {
    title: '无主内机',
    controlAble: false
  },
  LC: {
    title: '内外机机型不匹配',
    controlAble: false
  },
  o1: {
    title: '内机母线电压过低',
    controlAble: false
  },
  o2: {
    title: '内机母线电压过高',
    controlAble: false
  },
  o3: {
    title: '内机IPM模块保护',
    controlAble: false
  },
  o4: {
    title: '内机启动失败',
    controlAble: false
  },
  o5: {
    title: '内机过流保护',
    controlAble: false
  },
  o6: {
    title: '内机电流检测电路故障',
    controlAble: false
  },
  o7: {
    title: '内机失去保护',
    controlAble: false
  },
  o8: {
    title: '内机通讯驱动故障',
    controlAble: false
  },
  o9: {
    title: '内机主控通讯故障',
    controlAble: false
  },
  oA: {
    title: '内机模块温度过高',
    controlAble: false
  },
  ob: {
    title: '内机模块温度传感器故障',
    controlAble: false
  },
  oC: {
    title: '内机充电回路故障',
    controlAble: false
  }
};

export const codeParse = {
  ErrType1: ['L1', 'L3', 'd1', 'd3', 'd4', 'd6', 'd7', 'C0', 'C0', 'L7', 'dC', 'LC', 'o1', 'o2', 'o3', 'o4'],
  ErrType2: ['o5', 'o6', 'o7', 'o8', 'o9', 'oA', 'ob', 'oC', 'd9']
};
