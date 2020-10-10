/** mutations */
export const SET_DEVICE_INFO = 'SET_DEVICE_INFO'; // 设置deviceInfo
export const SET_MAC = 'SET_MAC'; // 设置mac
export const SET_SCROLL_Y = 'SET_SCROLL_Y'; // 设置滚动Y轴位置
export const SET_DATA_OBJECT = 'SET_DATA_OBJECT'; // 设备的各种状态
export const SET_CHECK_OBJECT = 'SET_CHECK_OBJECT'; // 用于检查的状态
export const IS_SCENE = 'IS_SCENE'; // 是否场景模式
export const SET_STATE = 'SET_STATE'; //

export const SET_MUSIC_DATA = 'SET_MUSIC_DATA'; //

// 根据业务逻辑修改

/** actions */
export const INIT = 'INIT'; // 初始化，并将小卡片传进来的值赋予 state
export const INIT_DEVICE_DATA = 'INIT_DEVICE_DATA'; // 初始化设备数据
export const GET_DEVICE_INFO = 'GET_DEVICE_INFO'; // 获取设备信息
export const GET_DEVICE_DATA = 'GET_DEVICE_DATA'; // 查询一包数据
export const PARSE_DATA_BY_COLS = 'PARSE_DATA_BY_COLS'; // 解析设备数据
export const SET_POLLING = 'SET_POLLING'; // 开启轮询
export const SEND_CTRL = 'SEND_CTRL'; // 发送控制指令
export const UPDATE_DATAOBJECT = 'UPDATE_DATAOBJECT'; // 更新本地数据
export const MQTT_CALLBACK = 'MQTT_CALLBACK'; // 原生调用插件的mqtt回调方法
