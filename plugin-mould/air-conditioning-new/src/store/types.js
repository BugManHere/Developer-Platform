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
  CONTROL_INIT: 'control',
  INIT_DEVICE_DATA: 'control',
  GET_DEVICE_INFO: 'control',
  GET_DEVICE_DATA: 'control',
  PARSE_DATA_BY_COLS: 'control',
  SET_POLLING: 'control',
  SEND_CTRL: 'control',
  UPDATE_DATAOBJECT: 'control',
  MQTT_CALLBACK: 'control',
  /** control mutations */
  SET_DEVICE_INFO: 'control',
  SET_MAC: 'control',
  SET_DATA_OBJECT: 'control',
  SET_CHECK_OBJECT: 'control',
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
