export const showToast = (msg, type) => {
  try {
    return navigator.PluginInterface.showToast(msg, type);
  } catch (error) {
    console.log('');
  }
};

export const editDevice = mac => {
  try {
    return navigator.PluginInterface.editDevice(mac);
  } catch (error) {
    console.log('');
  }
};

export const timerListDevice = mac => {
  return navigator.PluginInterface.timerListDevice(mac);
};

export const sendDataToDevice = (mac, json, isFollowSysVibration) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.sendDataToDevice(
        mac,
        json,
        isFollowSysVibration,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const sendDataToDevicePublic = (mac, json, isFollowSysVibration) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.sendDataToDevicePublic(
        mac,
        json,
        isFollowSysVibration,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const sendDataToDeviceDayPublic = (mac, json, isFollowSysVibration) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.sendDataToDeviceDayPublic(
        mac,
        json,
        isFollowSysVibration,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const closePage = result => {
  return navigator.PluginInterface.closePage(result);
};

export const getCCcmd = (mac, cmd, remarks, dat) => {
  return navigator.PluginInterface.getCCcmd(mac, cmd, remarks, dat);
};

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

export const changeBarColor = color => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.changeBarColor(color, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      // reject(err);
    }
  });
};

export const voiceDevice = mac => {
  return navigator.PluginInterface.voiceDevice(mac);
};

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

export const startSpeak = text => {
  return navigator.PluginInterface.startSpeak(text);
};

export const stopSpeak = () => {
  return navigator.PluginInterface.stopSpeak();
};

export const translateValue = jsonData => {
  return navigator.PluginInterface.translateValue(jsonData);
};

export const pluginTranslateData = (url, jsonData) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.pluginTranslateData(
        url,
        jsonData,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const saveUserInfo = (key, value) => {
  return navigator.PluginInterface.saveUserInfo(key, value);
};

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

export const backToHomePage = () => {
  return navigator.PluginInterface.backToHomePage();
};

export const sendDataToDeviceNoCallback = (mac, json, isFollowSysVibration) => {
  return navigator.PluginInterface.sendDataToDeviceNoCallback(
    mac,
    json,
    isFollowSysVibration
  );
};

export const pluginHttpPost = (url, paramsStr, headersStr) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.pluginHttpPost(
        url,
        paramsStr,
        headersStr,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

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

export const getAllTimerList = (subMac, mainMac) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getAllTimerList(
        subMac,
        mainMac,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const getAllSubDevices = (subMac, mainMac) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getAllSubDevices(
        subMac,
        mainMac,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const finishLoad = () => {
  return navigator.PluginInterface.finishLoad();
};

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

export const BLEAddMESH = (mac, subCount, hashList) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.BLEAddMESH(
        mac,
        subCount,
        hashList,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const BLEDelMESHSubDev = (mac, subCount, hashList) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.BLEDelMESHSubDev(
        mac,
        subCount,
        hashList,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const sendDataToDevicebyPower = (mac, json, isFollowSysVibration) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.sendDataToDevicebyPower(
        mac,
        json,
        isFollowSysVibration,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const callNumber = num => {
  return navigator.PluginInterface.callNumber(num);
};

export const toWebPage = (url, title) => {
  return navigator.PluginInterface.toWebPage(url, title);
};

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

export const showLoading = () => {
  try {
    return navigator.PluginInterface.showLoading();
  } catch (error) {
    console.log('');
  }
};

export const hideLoading = () => {
  try {
    return navigator.PluginInterface.hideLoading();
  } catch (error) {
    console.log('');
  }
};

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

// 蒸烤双能机___获取云菜谱列表
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

//蒸烤双能机___搜索云菜单
export const searchCloudMenu = (keyword, mid, index, cnt) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.searchCloudMenu(
        keyword,
        mid,
        index,
        cnt,
        (...args) => {
          resolve(...args);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

// 蒸烤双能机___获取云菜单详细步骤
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

// 写入用户自有数据
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

// 读取用户自有数据
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

// 涂鸦获取设备详细数据
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

// 涂鸦获取设备历史消息
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

// 欧瑞博获取设备详细数据
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

// 欧瑞博获取设备历史消息
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

// 总部展厅-五大系统-主体取数接口
export const getFiveSystemDevicesAllStatus = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getFiveSystemDevicesAllStatus(
        mac,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

// 播放音乐 index
export const startSleepMusic = index => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.startSleepMusic(index, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 试听： 播放音乐 index
export const tryPlaySleepMusic = (index, status) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.tryPlaySleepMusic(
        index,
        status,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

// 当前家庭所在家庭列表index
export const getCurrentHomeList = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getCurrentHomeList((...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 联动数据(开关)
export const getMainPageData = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getMainPageData(mac, (...params) => {
        resolve(...params);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 入睡提醒 保存
//  { mac: , hour: ,min: , currentHome: , currentScene: , smartMode: true, musicId:  }
// export const musiGetData = (mac, data, functionName) => {
//   return new Promise((resolve, reject) => {
//     try {
//       navigator.PluginInterface[functionName](mac, data, callback => {
//         resolve(callback);
//       });
//     } catch (err) {
//       reject(err);
//     }
//   });
// };
//获取当前账号创建的家庭里对应的场景列表
export const getDesignatedHomeSceneList = homeId => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getDesignatedHomeSceneList(homeId, callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};
//创建/编辑 联动
export const creteOrEditLink = json => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.creteOrEditLink(json, callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};
//打开睡眠的入睡提醒/懒人起床 请求保存的联动数据
export const getDevCustomData = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getDevCustomData(mac, callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};
// 控制入睡提醒、懒人起床、智能模式开关
export const requestStartLinkTask = (iid, opt) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.requestStartLinkTask(iid, opt, callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};
// 获取家庭列表
export const getCurrentHomeSceneList = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getCurrentHomeSceneList(callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 获取播放信息
export const getPlayStatus = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getPlayStatus(callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 播放暂停音乐
export const playOrPauseMusic = () => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.playOrPauseMusic(callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};
// 播放暂停音乐
export const editOrCreateLinkScene = json => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.editOrCreateLinkScene(json, callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};
// 打开/关闭 智慧睡眠-智能调节
export const setIntelligenceSwitch = opt => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.setIntelligenceSwitch(opt, callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};
// 查询联动信息
export const getLinkItemData = iid => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getLinkItemData(iid, callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};
// 跳转场景编辑页面
export const goToEditScene = index => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.goToEditScene(index, callback => {
        resolve(callback);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 调试用！！！！ musiGetData 慕思所有接口的请求
export const musiGetData = (mac, data, functionName) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('调试的接口');
      switch (functionName) {
        case 'getDerucciGetBedStatus':
          navigator.PluginInterface.getDerucciGetBedStatus(
            mac,
            data,
            (...callback) => {
              resolve(...callback);
            }
          );
          break;
        case 'getDerucciGetSleepData':
          navigator.PluginInterface.getDerucciGetSleepData(
            mac,
            data,
            (...callback) => {
              resolve(...callback);
            }
          );
          break;
        case 'getDerucciGetDateList':
          navigator.PluginInterface.getDerucciGetDateList(
            mac,
            data,
            (...callback) => {
              resolve(...callback);
            }
          );
          break;
        case 'getDerucciWeekList':
          console.log('-----------');
          navigator.PluginInterface.getDerucciWeekList(
            mac,
            data,
            (...callback) => {
              resolve(...callback);
            }
          );
          break;
        case 'getDerucciSetPressure':
          navigator.PluginInterface.getDerucciSetPressure(
            mac,
            data,
            (...callback) => {
              resolve(...callback);
            }
          );
          break;
        case 'getDerucciSmartConfig':
          navigator.PluginInterface.getDerucciSmartConfig(
            mac,
            data,
            (...callback) => {
              resolve(...callback);
            }
          );
          break;
        case 'getDerucciLadyInfo':
          navigator.PluginInterface.getDerucciLadyInfo(
            mac,
            data,
            (...callback) => {
              resolve(...callback);
            }
          );
          break;
        case 'getDerucciGetLadyInfo':
          navigator.PluginInterface.getDerucciGetLadyInfo(
            mac,
            data,
            (...callback) => {
              resolve(...callback);
            }
          );
          break;
        case 'getDerucciGetSleepAllData':
          navigator.PluginInterface.getDerucciGetSleepAllData(
            mac,
            data,
            (...callback) => {
              resolve(...callback);
            }
          );
          break;

        default:
          break;
      }
    } catch (err) {
      reject(err);
    }
  });
};

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

export const getGridConListOneDay = (mac, range, oneDay) => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.getGridConListOneDay(
        mac,
        range,
        oneDay,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

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

export const clearHistoricalPhotovoltaicPowerData = mac => {
  return new Promise((resolve, reject) => {
    try {
      navigator.PluginInterface.clearHistoricalPhotovoltaicPowerData(
        mac,
        (...params) => {
          resolve(...params);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};
