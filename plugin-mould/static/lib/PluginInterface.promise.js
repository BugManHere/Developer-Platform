export const showToast = (msg, type) => {
  return navigator.PluginInterface.showToast(msg, type);
};

export const editDevice = mac => {
  return navigator.PluginInterface.editDevice(mac);
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
  return navigator.PluginInterface.showLoading();
};

export const hideLoading = () => {
  return navigator.PluginInterface.hideLoading();
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
