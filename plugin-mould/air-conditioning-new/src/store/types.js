const typesMap = {
  /** root actions */
  STATE_MACHINE_INITDATA: null,
  STATE_MACHINE_INTERFACE: null,
  UPDATE_DEVICENAME: null,
  SEND_DATA: null,

  /** machine actions */
  MACHINE_INIT: 'machine',
  RUN_EVENT: 'machine',
  /** machine mutations */
  MACHINE_SET_STATE: 'machine',
  SET_BASEDATA: 'machine',
  GET_STATUS_NAME: 'machine',

  /** control actions */
  CONTROL_INIT: 'control', // 初始化
  INIT_DEVICE_DATA: 'control', // 初始化设备数据
  GET_DEVICE_INFO: 'control', // 获取设备信息
  GET_DEVICE_DATA: 'control', // 查询一包数据
  SET_POLLING: 'control', // 开启轮询
  SEND_CTRL: 'control', // 发送控制指令
  UPDATE_DATAOBJECT: 'control', // 更新本地数据
  MQTT_CALLBACK: 'control', // 原生调用插件的mqtt回调方法
  /** control mutations */
  SET_DEVICE_INFO: 'control', // 设置deviceInfo
  SET_MAC: 'control', // 设置mac
  SET_DATA_OBJECT: 'control', // 设备的各种状态
  SET_CHECK_OBJECT: 'control', // 用于检查的状态
  CONTROL_SET_STATE: 'control'
};

export const types = parseTypes(typesMap); // 调用时用
export const defineTypes = parseTypes(typesMap, false); // 定义时用

function parseTypes(map, hasNameSpace = true) {
  const result = {};
  const typeNames = Object.keys(map);
  typeNames.forEach(typeName => {
    // 命名空间
    let nameSpace = map[typeName];
    // 将命名空间拼接进函数名内
    const name = nameSpace && hasNameSpace ? `${nameSpace}/${typeName}` : typeName;
    result[typeName] = name;
  });
  return result;
}
