/** mutations */
export const SET_DEVICE_INFO = 'SET_DEVICE_INFO'; // 设置deviceInfo
export const SET_MAC = 'SET_MAC'; // 设置mac
export const SET_DATA_OBJECT = 'SET_DATA_OBJECT'; // 设备的各种状态
export const SET_CHECK_OBJECT = 'SET_CHECK_OBJECT'; // 用于检查的状态
export const SET_STATE = 'SET_STATE'; //
export const SET_CHART_DATA = 'SET_CHART_DATA'; //
export const SET_POLLING = 'SET_POLLING'; //

// 根据业务逻辑修改

/** actions */
export const INIT = 'INIT';
export const INIT_DEVICE_DATA = 'INIT_DEVICE_DATA';
export const MQTT_CALLBACK = 'MQTT_CALLBACK';
export const PARSE_DATA_BY_COLS = 'PARSE_DATA_BY_COLS';
export const GET_DEVICE_INFO = 'GET_DEVICE_INFO'; // 获取设备信息
export const GET_DEVICE_DATA = 'GET_DEVICE_DATA';
export const SEND_CTRL = 'SEND_CTRL'; // 发送控制指令
export const UPDATE_DATAOBJECT = 'UPDATE_DATAOBJECT'; //
export const GET_CLOUD_TIMER = 'GET_CLOUD_TIMER'; // 查询云定时
