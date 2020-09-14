/**
 * @author IOTFE
 * @desc 原生与WebView通讯接口promise封装
 */

/**
 * Toast提示
 * @param {string} msg
 * @param {number} type
 */
export const showToast = (msg, type) => {
  try {
    return navigator.PluginInterface.showToast(msg, type);
  } catch (e) {
    console.log(`%c调用showToast：${msg}`, 'color:blue');
  }
};

/**
 * 跳转到设备编辑页
 * @param {string} mac
 */
export const editDevice = mac => {
  try {
    return navigator.PluginInterface.editDevice(mac);
  } catch (e) {
    console.error(e);
  }
};

/**
 * 跳转到设备预约页
 * @param {string} mac
 */
export const timerListDevice = mac => {
  try {
    return navigator.PluginInterface.timerListDevice(mac);
  } catch (e) {
    console.log('调用接口timerListDevice');
  }
};

/**
 * 发送json数据给设备
 * @param {string} mac
 * @param {string} json
 * @param {boolean} isFollowSysVibration
 */
export const sendDataToDevice = (mac, json, isFollowSysVibration) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.sendDataToDevice(mac, json, isFollowSysVibration, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      // reject(err);
      err;
    }
  });
};

/**
 * 发送json数据到设备 公钥解密
 * @param {string} mac
 * @param {string} json
 * @param {boolean} isFollowSysVibration
 * @returns
 */
export const sendDataToDevicePublic = (mac, json, isFollowSysVibration) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.sendDataToDevicePublic(mac, json, isFollowSysVibration, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 发送json数据到设备 公钥解密
 * @param {string} mac
 * @param {string} json
 * @param {boolean} isFollowSysVibration
 * @returns
 */
export const sendDataToDeviceDayPublic = (mac, json, isFollowSysVibration) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.sendDataToDeviceDayPublic(mac, json, isFollowSysVibration, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 关闭H5(WebView)页面
 * @param {*} result
 */
export const closePage = result => {
  try {
    return navigator.PluginInterface.closePage(result);
  } catch (e) {
    console.error(e);
  }
};

/**
 * 调用主体场景功能
 * @param {string} mac
 * @param {*} cmd
 * @param {string} remarks
 * @param {string} dat
 */
export const getCCcmd = (mac, cmd, remarks, dat) => {
  try {
    return navigator.PluginInterface.getCCcmd(mac, cmd, remarks, dat);
  } catch (e) {
    console.error(e);
  }
};

/**
 * 获取设备查询字段以及查看设备是否在线
 * @param {string} mac
 */
export const getInfo = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getInfo(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 改变标题栏颜色（空字符串时不改变颜色）
 * @param {string} color
 */
export const changeBarColor = color => {
  return new Promise(resolve => {
    try {
      navigator.PluginInterface.changeBarColor(color, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      console.log(`%c调用changeBarColor改变颜色：${color}`, `color:${color}`);
      // reject(err);
    }
  });
};

/**
 * 2.0已废弃，不需要此接口
 * @param {string} mac
 */
export const voiceDevice = mac => {
  try {
    return navigator.PluginInterface.voiceDevice(mac);
  } catch (e) {
    console.error(e);
  }
};

/**
 * 更新H5页面中的状态信息给主体
 * @param {string} mac
 * @param {*} states
 */
export const updateStates = (mac, states) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.updateStates(mac, states, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 打开新页面
 * @param {string} url
 */
export const newPage = url => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.newPage(url, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Cordova初始化成功后回调
 */
export const onCallBack = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.onCallBack((...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 日期时间选择Dialog
 * @param {number} type
 */
export const showTimePicker = type => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.showTimePicker(type, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 弹出提示对话框
 * @param {*} title
 * @param {*} msg
 */
export const showAlert = (title, msg) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.showAlert(title, msg, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 弹出确认对话框
 * @param {*} title
 * @param {*} msg
 */
export const showConfirm = (title, msg) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.showConfirm(title, msg, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 拍照、选择图片对话框
 * @param {string} mac
 * @returns
 */
export const showMenuDialog = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.showMenuDialog(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 添加储存数据
 * @param {string} mac
 * @param {string} key
 * @param {string} val
 */
export const addStore = (mac, key, val) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.updateStates(mac, key, val, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 更新储存数据
 * @param {string} mac
 * @param {string} key
 * @param {string} val
 */
export const updateStore = (mac, key, val) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.updateStore(mac, key, val, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 删除储存数据
 * @param {string} mac
 * @param {string} key
 * @returns
 */
export const deleteStore = (mac, key) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.deleteStore(mac, key, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 查询储存数据
 *
 * @param {string} mac
 * @param {string} key
 * @returns
 */
export const queryStore = (mac, key) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.queryStore(mac, key, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 查询全部数据
 * @param {string} mac
 */
export const queryAllStore = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.queryAllStore(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 删除全部储存数据
 * @param {string} mac
 */
export const deleteAllStore = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.deleteAllStore(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 反馈接口
 * @param {*} mac
 */
export const feedbackCommit = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.feedbackCommit(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 弹出语音监听Dialog
 */
export const startVoice = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.startVoice((...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 开始播报
 * @param {string} text
 */
export const startSpeak = text => {
  try {
    return navigator.PluginInterface.startSpeak(text);
  } catch (e) {
    console.error(e);
  }
};

/**
 * 结束播报
 */
export const stopSpeak = () => {
  try {
    return navigator.PluginInterface.stopSpeak();
  } catch (e) {
    console.error(e);
  }
};

/**
 * 发送给设备的json字段跟机型相关
 * @param {string} jsonData
 */
export const translateValue = jsonData => {
  try {
    return navigator.PluginInterface.translateValue(jsonData);
  } catch (e) {
    console.error(e);
  }
};

/**
 * 冰箱食材
 * @param {string} url
 * @param {string} jsonData
 */
export const pluginTranslateData = (url, jsonData) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.pluginTranslateData(url, jsonData, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 保存用户信息
 * @param {string} key
 * @param {string} value
 */
export const saveUserInfo = (key, value) => {
  try {
    return navigator.PluginInterface.saveUserInfo(key, value);
  } catch (e) {
    console.error(e);
  }
};

/**
 * 获取用户信息
 * @param {string} key
 * @param {string} value
 */
export const getUserInfo = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getUserInfo(key, value, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 跳转到主界面
 */
export const backToHomePage = () => {
  try {
    return navigator.PluginInterface.backToHomePage();
  } catch (e) {
    console.error(e);
  }
};

/**
 * 发送json到设备
 * @param {string} mac
 * @param {string} json
 * @param {boolean} isFollowSysVibration
 */
export const sendDataToDeviceNoCallback = (mac, json, isFollowSysVibration) => {
  try {
    return navigator.PluginInterface.sendDataToDeviceNoCallback(mac, json, isFollowSysVibration);
  } catch (e) {
    console.error(e);
  }
};

/**
 * post方式http接口
 * @param {*} url
 * @param {*} paramsStr
 * @param {*} headersStr
 */
export const pluginHttpPost = (url, paramsStr, headersStr) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.pluginHttpPost(url, paramsStr, headersStr, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 开始语音监听无UI
 */
export const startListening = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.startListening((...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 添加存储数据（数组）
 * @param {*} val
 */
export const addStoreList = val => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.addStoreList(val, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 多联机获取主设备全部预约
 * @param {*} subMac
 * @param {*} mainMac
 */
export const getAllTimerList = (subMac, mainMac) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getAllTimerList(subMac, mainMac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 多联机获取子设备列表
 * @param {*} subMac
 * @param {*} mainMac
 */
export const getAllSubDevices = (subMac, mainMac) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getAllSubDevices(subMac, mainMac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 结束Loading
 */
export const finishLoad = () => {
  try {
    return navigator.PluginInterface.finishLoad();
  } catch (e) {
    console.error(e);
  }
};

/**
 * BLE网关搜索周围的蓝牙设备
 * @param {*} isStart
 * @param {string} mac
 */
export const searchSubBLE = (isStart, mac) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.searchSubBLE(isStart, mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 蓝牙组网
 * @param {string} mac
 * @param {number} subCount
 * @param {*} hashList
 */
export const BLEAddMESH = (mac, subCount, hashList) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.BLEAddMESH(mac, subCount, hashList, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 删除蓝牙子设备
 * @param {string} mac
 * @param {number} subCount
 * @param {*} hashList
 * @returns
 */
export const BLEDelMESHSubDev = (mac, subCount, hashList) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.BLEDelMESHSubDev(mac, subCount, hashList, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 体检电量
 * @param {string} mac
 * @param {string} json
 * @param {boolean} isFollowSysVibration
 */
export const sendDataToDevicebyPower = (mac, json, isFollowSysVibration) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.sendDataToDevicebyPower(mac, json, isFollowSysVibration, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 拨打电话
 * @param {string} num
 */
export const callNumber = num => {
  try {
    return navigator.PluginInterface.callNumber(num);
  } catch (e) {
    console.error(e);
  }
};

/**
 * 跳转webView
 * @param {*} url
 * @param {*} title
 */
export const toWebPage = (url, title) => {
  try {
    return navigator.PluginInterface.toWebPage(url, title);
  } catch (e) {
    console.error(e);
  }
};

/**
 * 第三方请求
 * @param {*} json
 * @param {*} url
 */
export const thirdPlatformRequest = (json, url) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.thirdPlatformRequest(json, url, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 获取插件是否debug模式
 */
export const getCurrentMode = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getCurrentMode((...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 显示阻塞加载Loading
 */
export const showLoading = () => {
  try {
    return navigator.PluginInterface.showLoading();
  } catch (e) {
    e;
  }
};

/**
 * 隐藏阻塞加载Loading
 */
export const hideLoading = () => {
  try {
    return navigator.PluginInterface.hideLoading();
  } catch (e) {
    e;
  }
};

/**
 * 获取海拔
 * @param {string} mac
 */
export const getSeaHeight = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getSeaHeight(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 连接到BLE设备
 * @param {string} mac
 */
export const connectBleDevice = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.connectBleDevice(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 通过mac获取设备对应房间下的所有设备数量
 * @param {string} mac
 */
export const getRoomDeviceSize = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getRoomDeviceSize(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 蒸烤双能机___获取云菜谱列表
 */
export const getCloudMenuList = (mid, index, cnt) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getCloudMenuList(mid, index, cnt, (...args) => {
        resolve(...args);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 蒸烤双能机___获取云菜单详细步骤
 */
export const getCloudMenuDetailSteps = cid => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getCloudMenuDetailSteps(cid, (...args) => {
        resolve(...args);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 蒸烤双能机___搜索云菜单
 */
export const searchCloudMenu = (keyword, mid, index, cnt) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.searchCloudMenu(keyword, mid, index, cnt, (...args) => {
        resolve(...args);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 获取一日三餐推荐菜谱
 */
export const getRecommendedMenu = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getRecommendedMenu((...args) => {
        resolve(...args);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 添加菜谱到菜篮子
 */
export const addDishToBasket = addDatas => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.addDishToBasket(addDatas, (...args) => {
        resolve(...args);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 从菜篮子里移除菜谱
 */
export const removeDishFromBasket = idsStr => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.removeDishFromBasket(idsStr, (...args) => {
        resolve(...args);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 获取菜篮子列表
 */
export const getDishFromBasket = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getDishFromBasket((...args) => {
        resolve(...args);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 菜谱：菜篮子分享
 * @param {Array<number>} basketArr
 * @returns
 */
export const shareDishBasket = basketArr => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.shareDishBasket(basketArr, (...args) => {
        resolve(...args);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 菜谱：长按监听振动
 */
export const longClickListenerVibrator = () => {
  try {
    return navigator.PluginInterface.longClickListenerVibrator();
  } catch (e) {
    console.error(e);
  }
};

/**
 * 菜谱：生成清单
 */
export const generateMenuListByCaptureImg = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.generateMenuListByCaptureImg((...args) => {
        resolve(...args);
      });
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * 写入用户自有数据
 * @param {string} key
 * @param {*} value
 */
export const setUserData = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.setUserData(key, value, (...args) => {
        resolve(...args);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 读取用户自有数据
 * @param {string} key
 */
export const getUserData = key => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getUserData(key, (...args) => {
        resolve(...args);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 菜篮子分享URL
 * @param {string} url
 */
export const shareDishBasketUrl = url => {
  try {
    return navigator.PluginInterface.shareDishBasketUrl(url);
  } catch (e) {
    console.error(e);
  }
};

export const screenControl = (mac, json) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.screenControl(mac, json, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 欧瑞博获取设备详细数据
 * @param {string} mac
 */
export const getOuriboDevicesAllStatus = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getOuriboDevicesAllStatus(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 欧瑞博获取设备历史消息
 * @param {string} mac
 */
export const getMsgRequest = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getMsgRequest(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 获取光伏空调用电统计
 * @param {string} mac
 * @param {string} type
 */
export const getGridConLis = (mac, type) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getGridConList(mac, type, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 清除光伏空调历史电量数据
 * @param {string} mac
 */
export const clearHistoricalPhotovoltaicPowerData = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.clearHistoricalPhotovoltaicPowerData(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 总部展厅-五大系统-主体取数接口
 * @param {string} mac
 */
export const getFiveSystemDevicesAllStatus = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getFiveSystemDevicesAllStatus(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/** ============================== 涂鸦体脂称接口 start ============================== */

/**
 * 涂鸦获取设备详细数据
 * @param {string} mac
 */
export const tuyaRequestDevData = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaRequestDevData(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 涂鸦获取设备历史消息
 * @param {string} mac
 */
export const tuyaGetDevLogs = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaGetDevLogs(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 涂鸦体脂称新增用户接口
 * @param {string} mac
 * @param WeightData
 */
export const tuyaWeightAdd = (mac, WeightData) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaWeightAdd(mac, WeightData, (...params) => {
        resolve(...params);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 涂鸦体脂秤用户查询接口
 * @param {string} mac
 * @param userId
 */
export const tuyaWeightQuery = (mac, userId) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaWeightQuery(mac, userId, (...params) => {
        resolve(...params);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 涂鸦体脂秤用户删除
 * @param {string} mac
 * @param userId
 */
export const tuyaWeightDelete = (mac, userId) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaWeightDelete(mac, userId, (...params) => {
        resolve(...params);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 涂鸦体脂秤用户更新接口
 * @param {string} mac
 * @param updateData
 */
export const tuyaWeightUpdate = (mac, updateData) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaWeightUpdate(mac, updateData, (...params) => {
        resolve(...params);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 涂鸦体脂称获取历史记录
 * @param {string} mac
 * @param requestData
 */
export const tuyaWeightHistory = (mac, requestData) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaWeightHistory(mac, requestData, (...params) => {
        resolve(...params);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 涂鸦体脂称体重趋势获取
 * @param {string} mac
 * @param userId
 * @param startDay
 * @param endDay
 */
export const tuyaWeightTrend = (mac, userId, startDay, endDay) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaWeightTrend(mac, userId, startDay, endDay, (...params) => {
        resolve(...params);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 涂鸦体脂称认领单个称重记录
 * @param {string} mac
 * @param userId
 * @param id
 */
export const tuyaWeightCheckData = (mac, userId, id) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaWeightCheckData(mac, userId, id, (...params) => {
        resolve(...params);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 涂鸦体脂秤删除单个称重记录
 * @param {string} mac
 * @param id
 */
export const tuyaWeightHistorySingleDelete = (mac, id) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaWeightHistorySingleDelete(mac, id, (...params) => {
        resolve(...params);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 涂鸦体脂称查询用户列表
 * @param {string} mac
 */
export const tuyaWeightList = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaWeightList(mac, (...params) => {
        resolve(...params);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 涂鸦体脂秤计算报告接口
 * @param {string} mac
 * @param requestData
 */
export const tuyaWeightDatas = (mac, requestData) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tuyaWeightDatas(mac, requestData, (...params) => {
        resolve(...params);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/** ============================== 涂鸦体脂称接口 end ============================== */

// 语音技能接口
export const startVoiceMainActivity = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.startVoiceMainActivity(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 电量统计
export const getGridConList = (mac, range) => {
  console.log('!@@@@@@@@@@@@@@');
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getGridConList(mac, range, (...params) => {
        console.log('...params', ...params);
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 故障查询
export const getDevRealTimeFault = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getDevRealTimeFault(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 获取消息提醒列表
 */
export const getMsg = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getMsg((...args) => {
        resolve(...args);
      });
    } catch (error) {
      error;
    }
  });
};
/**
 * 影子设备项目中，提供回调让App主动传递变更的数据给插件页
 * @param {string} mac
 */
export const setMqttStatusCallback = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.setMqttStatusCallback(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};
