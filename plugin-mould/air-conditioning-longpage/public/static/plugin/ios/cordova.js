var callBackDict = {};

function getCallBackIdWithCallBack(callback) {
  var my = new Date();
  var callbackId = 'Plugins' + my.getTime() + parseInt(Math.random() * 1000);
  callBackDict[callbackId] = callback;
  return callbackId;
}

// eslint-disable-next-line no-unused-vars
function pluginsInterfaceCallBack(callbackId, param) {
  var callBack = callBackDict[callbackId];
  if (callBack != undefined) {
    callBack(param);
  }
  delete callBackDict[callbackId];
}

// eslint-disable-next-line no-unused-vars
function pluginsInterfaceCallBack1(callbackId, param) {
  var callBack = callBackDict[callbackId];
  if (callBack != undefined) {
    callBack(param);
  }
  // delete callBackDict[callbackId];
}

function gt_ios9() {
  var ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
  ver = parseInt(ver[1], 10);
  if (ver >= 9) {
    return true;
  } else {
    return false;
  }
}

function PluginInterface() {
  this.showToast = function(msg, type) {
    var args = [msg, type];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.showToast(param);
    } else {
      window.webkit.messageHandlers.showToast.postMessage(param);
    }
  };

  this.editDevice = function(mac) {
    var args = [mac];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.editDevice(param);
    } else {
      window.webkit.messageHandlers.editDevice.postMessage(param);
    }
  };

  this.startVoiceMainActivity = function(mac) {
    var args = [mac];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.startVoiceMainActivity(param);
    } else {
      window.webkit.messageHandlers.startVoiceMainActivity.postMessage(param);
    }
  };

  this.timerListDevice = function(mac) {
    var args = [mac];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.timerListDevice(param);
    } else {
      window.webkit.messageHandlers.timerListDevice.postMessage(param);
    }
  };

  // 影子设备项目中，提供回调让App主动传递变更的数据给插件页
  this.setMqttStatusCallback = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.setMqttStatusCallback(param);
    } else {
      window.webkit.messageHandlers.setMqttStatusCallback.postMessage(param);
    }
  };

  this.sendDataToDevice = function(mac, json, isFollowSysVibration, callback) {
    var args = [mac, json, isFollowSysVibration];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.sendDataToDevice(param);
    } else {
      window.webkit.messageHandlers.sendDataToDevice.postMessage(param);
    }
  };

  this.sendDataToDevicePublic = function(mac, json, isFollowSysVibration, callback) {
    var args = [mac, json, isFollowSysVibration];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.sendDataToDevicePublic(param);
    } else {
      window.webkit.messageHandlers.sendDataToDevicePublic.postMessage(param);
    }
  };

  this.closePage = function(json) {
    var args = [json];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.closePage(param);
    } else {
      window.webkit.messageHandlers.closePage.postMessage(param);
    }
  };

  this.getCCcmd = function(mac, cmd, remarks, dat) {
    var args = [mac, cmd, remarks, dat];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.getCCcmd(param);
    } else {
      window.webkit.messageHandlers.getCCcmd.postMessage(param);
    }
  };

  this.getInfo = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getInfo(param);
    } else {
      window.webkit.messageHandlers.getInfo.postMessage(param);
    }
  };

  this.changeBarColor = function(color, callback) {
    var args = [color];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.changeBarColor(param);
    } else {
      window.webkit.messageHandlers.changeBarColor.postMessage(param);
    }
  };

  this.voiceDevice = function(mac) {
    var args = [mac];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.voiceDevice(param);
    } else {
      window.webkit.messageHandlers.voiceDevice.postMessage(param);
    }
  };

  this.updateStates = function(mac, states) {
    var args = [mac, states];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.updateStates(param);
    } else {
      window.webkit.messageHandlers.updateStates.postMessage(param);
    }
  };

  this.newPage = function(url, callback) {
    var args = [url];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.newPage(param);
    } else {
      window.webkit.messageHandlers.newPage.postMessage(param);
    }
  };

  this.onCallBack = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.onCallBack(param);
    } else {
      window.webkit.messageHandlers.onCallBack.postMessage(param);
    }
  };

  this.showTimePicker = function(type, callback) {
    var args = [type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.showTimePicker(param);
    } else {
      window.webkit.messageHandlers.showTimePicker.postMessage(param);
    }
  };

  this.showAlert = function(title, msg, callback) {
    var args = [title, msg];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.showAlert(param);
    } else {
      window.webkit.messageHandlers.showAlert.postMessage(param);
    }
  };

  this.showConfirm = function(title, msg, callback) {
    var args = [title, msg];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.showConfirm(param);
    } else {
      window.webkit.messageHandlers.showConfirm.postMessage(param);
    }
  };

  this.showMenuDialog = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.showMenuDialog(param);
    } else {
      window.webkit.messageHandlers.showMenuDialog.postMessage(param);
    }
  };

  this.addStore = function(mac, key, val, callback) {
    var args = [mac, key, val];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.addStore(param);
    } else {
      window.webkit.messageHandlers.addStore.postMessage(param);
    }
  };

  this.updateStore = function(mac, key, val, callback) {
    var args = [mac, key, val];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.updateStore(param);
    } else {
      window.webkit.messageHandlers.updateStore.postMessage(param);
    }
  };

  this.deleteStore = function(mac, key, callback) {
    var args = [mac, key];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.deleteStore(param);
    } else {
      window.webkit.messageHandlers.deleteStore.postMessage(param);
    }
  };

  this.queryStore = function(mac, key, callback) {
    var args = [mac, key];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.queryStore(param);
    } else {
      window.webkit.messageHandlers.queryStore.postMessage(param);
    }
  };

  this.queryAllStore = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.queryAllStore(param);
    } else {
      window.webkit.messageHandlers.queryAllStore.postMessage(param);
    }
  };

  this.deleteAllStore = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.deleteAllStore(param);
    } else {
      window.webkit.messageHandlers.deleteAllStore.postMessage(param);
    }
  };

  this.feedbackCommit = function(mac) {
    var args = [mac];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.feedbackCommit(param);
    } else {
      window.webkit.messageHandlers.feedbackCommit.postMessage(param);
    }
  };

  this.startVoice = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.startVoice(param);
    } else {
      window.webkit.messageHandlers.startVoice.postMessage(param);
    }
  };

  this.startSpeak = function(text) {
    var args = [text];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.startSpeak(param);
    } else {
      window.webkit.messageHandlers.startSpeak.postMessage(param);
    }
  };

  this.stopSpeak = function() {
    var args = [];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.stopSpeak(param);
    } else {
      window.webkit.messageHandlers.stopSpeak.postMessage(param);
    }
  };

  this.translateValue = function(jsonData) {
    var args = [jsonData];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.translateValue(param);
    } else {
      window.webkit.messageHandlers.translateValue.postMessage(param);
    }
  };

  this.pluginTranslateData = function(url, jsonData, callback) {
    var args = [url, jsonData];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.pluginTranslateData(param);
    } else {
      window.webkit.messageHandlers.pluginTranslateData.postMessage(param);
    }
  };

  this.backToHomePage = function() {
    var args = [];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.backToHomePage(param);
    } else {
      window.webkit.messageHandlers.backToHomePage.postMessage(param);
    }
  };

  this.saveUserInfo = function(key, val) {
    var args = [key, val];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.saveUserInfo(param);
    } else {
      window.webkit.messageHandlers.saveUserInfo.postMessage(param);
    }
  };

  this.getUserInfo = function(key, val, callback) {
    var args = [key, val];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getUserInfo(param);
    } else {
      window.webkit.messageHandlers.getUserInfo.postMessage(param);
    }
  };

  this.getPluginScript = function(path, callback) {
    var args = [path];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getPluginScript(param);
    } else {
      window.webkit.messageHandlers.getPluginScript.postMessage(param);
    }
  };

  this.startListening = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.startListening(param);
    } else {
      window.webkit.messageHandlers.startListening.postMessage(param);
    }
  };

  this.sendDataToDeviceNoCallback = function(mac, json, isFollowSysVibration) {
    var args = [mac, json, isFollowSysVibration];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.sendDataToDeviceNoCallback(param);
    } else {
      window.webkit.messageHandlers.sendDataToDeviceNoCallback.postMessage(param);
    }
  };

  this.sendDataToDeviceDayPublic = function(mac, json, isFollowSysVibration, callback) {
    var args = [mac, json, isFollowSysVibration];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.sendDataToDeviceDayPublic(param);
    } else {
      window.webkit.messageHandlers.sendDataToDeviceDayPublic.postMessage(param);
    }
  };

  this.pluginHttpPost = function(url, head, body, callback) {
    var args = [url, head, body];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.pluginHttpPost(param);
    } else {
      window.webkit.messageHandlers.pluginHttpPost.postMessage(param);
    }
  };

  this.pluginHttp = function(url, hearders, params, method, platform, extraParams, callback) {
    var args = [url, hearders, params, method, platform, extraParams];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.pluginHttp(param);
    } else {
      window.webkit.messageHandlers.pluginHttp.postMessage(param);
    }
  };

  this.getAllTimerList = function(mac, mainMac, callback) {
    var args = [mac, mainMac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getAllTimerList(param);
    } else {
      window.webkit.messageHandlers.getAllTimerList.postMessage(param);
    }
  };

  this.getAllSubDevices = function(mac, mainMac, callback) {
    var args = [mac, mainMac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getAllSubDevices(param);
    } else {
      window.webkit.messageHandlers.getAllSubDevices.postMessage(param);
    }
  };

  this.printLog = function(msg) {
    var args = [msg];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.printLog(param);
    } else {
      window.webkit.messageHandlers.printLog.postMessage(param);
    }
  };

  this.finishLoad = function() {
    var args = [];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.finishLoad(param);
    } else {
      window.webkit.messageHandlers.finishLoad.postMessage(param);
    }
  };

  this.callNumber = function(tel) {
    var args = [tel];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.callNumber(param);
    } else {
      window.webkit.messageHandlers.callNumber.postMessage(param);
    }
  };

  this.toWebPage = function(url, title) {
    var args = [url, title];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.toWebPage(param);
    } else {
      window.webkit.messageHandlers.toWebPage.postMessage(param);
    }
  };

  this.startVoice2 = function(text, callback) {
    var args = [text];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.startVoice2(param);
    } else {
      window.webkit.messageHandlers.startVoice2.postMessage(param);
    }
  };

  this.showLoading = function() {
    var args = [];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.showLoading(param);
    } else {
      window.webkit.messageHandlers.showLoading.postMessage(param);
    }
  };

  this.hideLoading = function() {
    var args = [];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.hideLoading(param);
    } else {
      window.webkit.messageHandlers.hideLoading.postMessage(param);
    }
  };

  this.getCurrentMode = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCurrentMode(param);
    } else {
      window.webkit.messageHandlers.getCurrentMode.postMessage(param);
    }
  };

  this.sendDataToDevicebyPower = function(mac, json, isFollowSysVibration, callback) {
    var args = [mac, json, isFollowSysVibration];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.sendDataToDevicebyPower(param);
    } else {
      window.webkit.messageHandlers.sendDataToDevicebyPower.postMessage(param);
    }
  };

  this.faceControl = function(mac, did) {
    var args = [mac, did];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.faceControl(param);
    } else {
      window.webkit.messageHandlers.faceControl.postMessage(param);
    }
  };

  this.securityControl = function(mac, did) {
    var args = [mac, did];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.securityControl(param);
    } else {
      window.webkit.messageHandlers.securityControl.postMessage(param);
    }
  };

  // lucasjunjie
  this.placetroopsControl = function(mac, did) {
    var args = [mac, did];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.placetroopsControl(param);
    } else {
      window.webkit.messageHandlers.placetroopsControl.postMessage(param);
    }
  };

  // 海拔
  this.getSeaHeight = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getSeaHeight(param);
    } else {
      window.webkit.messageHandlers.getSeaHeight.postMessage(param);
    }
  };

  // 离线弹框
  this.showOfflineAlertView = function() {
    var args = [];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.showOfflineAlertView(param);
    } else {
      window.webkit.messageHandlers.showOfflineAlertView.postMessage(param);
    }
  };

  // 获取光伏空调当日用电/发电量统计数据
  this.getDayUseAndGenerElec = function(mac, oneday, callback) {
    var args = [mac, oneday];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDayUseAndGenerElec(param);
    } else {
      window.webkit.messageHandlers.getDayUseAndGenerElec.postMessage(param);
    }
  };

  // 获取光伏空调发电量统计数据
  this.getElecGenerList = function(mac, type, oneday, callback) {
    var args = [mac, type, oneday];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getElecGenerList(param);
    } else {
      window.webkit.messageHandlers.getElecGenerList.postMessage(param);
    }
  };

  // 获取光伏空调用电统计数据
  this.getGridConList = function(mac, type, callback) {
    var args = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getGridConList(param);
    } else {
      window.webkit.messageHandlers.getGridConList.postMessage(param);
    }
  };

  // 获取光伏空调用电统计数据（带参数）
  this.getGridConListOneDay = function(mac, type, oneday, callback) {
    var args = [mac, type, oneday];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getGridConListOneDay(param);
    } else {
      window.webkit.messageHandlers.getGridConListOneDay.postMessage(param);
    }
  };

  // 清除普通空调历史电量数据
  this.clearHistoricalPowerData = function(mac, type, callback) {
    var args = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.clearHistoricalPowerData(param);
    } else {
      window.webkit.messageHandlers.clearHistoricalPowerData.postMessage(param);
    }
  };

  // 高泳诗+写入用户自有数据
  this.setUserData = function(key, value, callback) {
    var args = [key, value];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.setUserData(param);
    } else {
      window.webkit.messageHandlers.setUserData.postMessage(param);
    }
  };

  // 高泳诗+读取用户自有数据
  this.getUserData = function(key, callback) {
    var args = [key];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getUserData(param);
    } else {
      window.webkit.messageHandlers.getUserData.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___获取云菜谱列表
  this.getCloudMenuList = function(mid, index, cnt, callback) {
    var args = [mid, index, cnt];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCloudMenuList(param);
    } else {
      window.webkit.messageHandlers.getCloudMenuList.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___搜索一日三餐推荐菜谱
  this.getRecommendedMenu = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getRecommendedMenu(param);
    } else {
      window.webkit.messageHandlers.getRecommendedMenu.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___添加菜谱到菜篮子
  this.addDishToBasket = function(addDatas, callback) {
    var args = [addDatas];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.addDishToBasket(param);
    } else {
      window.webkit.messageHandlers.addDishToBasket.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___从菜篮子里移除菜谱
  this.removeDishFromBasket = function(idsArr, callback) {
    var args = [idsArr];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.removeDishFromBasket(param);
    } else {
      window.webkit.messageHandlers.removeDishFromBasket.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___获取菜篮子列表
  this.getDishFromBasket = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDishFromBasket(param);
    } else {
      window.webkit.messageHandlers.getDishFromBasket.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___获取菜篮子列表
  this.generateMenuListByCaptureImg = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.generateMenuListByCaptureImg(param);
    } else {
      window.webkit.messageHandlers.generateMenuListByCaptureImg.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___长按监听震动
  this.longClickListenerVibrator = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.longClickListenerVibrator(param);
    } else {
      window.webkit.messageHandlers.longClickListenerVibrator.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___获取云菜单
  this.searchCloudMenu = function(keyword, mid, index, cnt, callback) {
    var args = [keyword, mid, index, cnt];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.searchCloudMenu(param);
    } else {
      window.webkit.messageHandlers.searchCloudMenu.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___获取云菜单详细步骤
  this.getCloudMenuDetailSteps = function(cid, callback) {
    var args = [cid];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCloudMenuDetailSteps(param);
    } else {
      window.webkit.messageHandlers.getCloudMenuDetailSteps.postMessage(param);
    }
  };

  // 高泳诗+食谱的分享
  this.shareDishBasketUrl = function(shareUrl, callback) {
    var args = [shareUrl];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.shareDishBasketUrl(param);
    } else {
      window.webkit.messageHandlers.shareDishBasketUrl.postMessage(param);
    }
  };

  // 高泳诗+食谱服务器的分享
  this.shareDishBasket = function(basketArr, callback) {
    var args = [basketArr];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.shareDishBasket(param);
    } else {
      window.webkit.messageHandlers.shareDishBasket.postMessage(param);
    }
  };

  // 高泳诗+红外1
  this.addDefineOfLearningResult = function(mac, opt, p, callback) {
    var args = [mac, opt, p];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.addDefineOfLearningResult(param);
    } else {
      window.webkit.messageHandlers.addDefineOfLearningResult.postMessage(param);
    }
  };

  // 高泳诗+红外2
  this.delDefineOfLearningResult = function(mac, defineIds, callback) {
    var args = [mac, defineIds];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.delDefineOfLearningResult(param);
    } else {
      window.webkit.messageHandlers.delDefineOfLearningResult.postMessage(param);
    }
  };

  // 高泳诗+红外3
  this.getDefineOfLearningResultList = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDefineOfLearningResultList(param);
    } else {
      window.webkit.messageHandlers.getDefineOfLearningResultList.postMessage(param);
    }
  };

  // 高泳诗+欧瑞博
  this.greeSmartHome = function(mac, type, callback) {
    var args = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.greeSmartHome(param);
    } else {
      window.webkit.messageHandlers.greeSmartHome.postMessage(param);
    }
  };

  // 高泳诗+慕思获取查询T10实时数据
  this.getDerucciGetBedStatus = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetBedStatus(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetBedStatus.postMessage(param);
    }
  };

  // 高泳诗+慕思保存或修改女性生理信息
  this.getDerucciLadyInfo = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciLadyInfo(param);
    } else {
      window.webkit.messageHandlers.getDerucciLadyInfo.postMessage(param);
    }
  };

  // 高泳诗+慕思获取女性生理信息
  this.getDerucciGetLadyInfo = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetLadyInfo(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetLadyInfo.postMessage(param);
    }
  };

  // 高泳诗+慕思获取睡眠报告
  this.getDerucciGetSleepData = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetSleepData(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetSleepData.postMessage(param);
    }
  };

  // 高泳诗+慕思获取T10睡眠报告
  this.getDerucciGetSleepAllData = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetSleepAllData(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetSleepAllData.postMessage(param);
    }
  };

  // 高泳诗+慕思获取睡眠历史的日期列表
  this.getDerucciGetDateList = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetDateList(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetDateList.postMessage(param);
    }
  };

  // 高泳诗+慕思获取控制T10软硬度接口
  this.getDerucciSetPressure = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciSetPressure(param);
    } else {
      window.webkit.messageHandlers.getDerucciSetPressure.postMessage(param);
    }
  };

  // 高泳诗+慕思获取控制T10自动补气时间
  this.getDerucciSetTime = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciSetTime(param);
    } else {
      window.webkit.messageHandlers.getDerucciSetTime.postMessage(param);
    }
  };

  // 高泳诗+慕思T10软硬度精准推荐
  this.getDerucciGetRecommendData = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetRecommendData(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetRecommendData.postMessage(param);
    }
  };

  // 高泳诗+慕思T10智能模式配置接口
  this.getDerucciSmartConfig = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciSmartConfig(param);
    } else {
      window.webkit.messageHandlers.getDerucciSmartConfig.postMessage(param);
    }
  };

  // 高泳诗+慕思T10获取当前配置参数接口
  this.getDerucciGetSmartConfig = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetSmartConfig(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetSmartConfig.postMessage(param);
    }
  };

  // 高泳诗+慕思周、月睡眠报告补充字段
  this.getDerucciWeekList = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciWeekList(param);
    } else {
      window.webkit.messageHandlers.getDerucciWeekList.postMessage(param);
    }
  };

  // 高泳诗+慕思用户信息
  this.getDerucciUserInformation = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciUserInformation(param);
    } else {
      window.webkit.messageHandlers.getDerucciUserInformation.postMessage(param);
    }
  };

  // 高泳诗+修改设备名称(授权成功后)
  this.getDerucciSetDevice = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciSetDevice(param);
    } else {
      window.webkit.messageHandlers.getDerucciSetDevice.postMessage(param);
    }
  };

  // 高泳诗+欧瑞博给插件查询设备所有状态的接口
  this.getOuriboDevicesAllStatus = function(mac, type, callback) {
    var args = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getOuriboDevicesAllStatus(param);
    } else {
      window.webkit.messageHandlers.getOuriboDevicesAllStatus.postMessage(param);
    }
  };

  // 高泳诗+欧瑞博给插件RGB灯带控制颜色
  this.setLightBeltControl = function(endpointId, payload, callback) {
    var args = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.setLightBeltControl(param);
    } else {
      window.webkit.messageHandlers.setLightBeltControl.postMessage(param);
    }
  };

  // 高泳诗+欧瑞博+格力云绑定
  this.bindThirdPartyDev = function(mac, type, callback) {
    var args = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.bindThirdPartyDev(param);
    } else {
      window.webkit.messageHandlers.bindThirdPartyDev.postMessage(param);
    }
  };

  // 高泳诗+欧瑞博+格力云解绑
  this.unbindHomeThirdPartyDev = function(mac, type, callback) {
    var args = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.unbindHomeThirdPartyDev(param);
    } else {
      window.webkit.messageHandlers.unbindHomeThirdPartyDev.postMessage(param);
    }
  };

  // 获取普通空调用电统计数据
  this.getElecPowerConsumList = function(mac, type, callback) {
    var args = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getElecPowerConsumList(param);
    } else {
      window.webkit.messageHandlers.getElecPowerConsumList.postMessage(param);
    }
  };

  // 清除光伏空调历史电量数据
  this.clearHistoricalPhotovoltaicPowerData = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.clearHistoricalPhotovoltaicPowerData(param);
    } else {
      window.webkit.messageHandlers.clearHistoricalPhotovoltaicPowerData.postMessage(param);
    }
  };

  // 蓝牙接口
  this.connectBleDevice = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.connectBleDevice(param);
    } else {
      window.webkit.messageHandlers.connectBleDevice.postMessage(param);
    }
  };

  // 网关接口
  this.connectBleSubDevice = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.connectBleSubDevice(param);
    } else {
      window.webkit.messageHandlers.connectBleSubDevice.postMessage(param);
    }
  };

  this.getGatewayDevList = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getGatewayDevList(param);
    } else {
      window.webkit.messageHandlers.getGatewayDevList.postMessage(param);
    }
  };

  this.addBleSubDevice = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.addBleSubDevice(param);
    } else {
      window.webkit.messageHandlers.addBleSubDevice.postMessage(param);
    }
  };

  this.startPlugin = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.startPlugin(param);
    } else {
      window.webkit.messageHandlers.startPlugin.postMessage(param);
    }
  };

  // 传当前房间设备的个数给环境感知器 by朱运发
  this.getRoomDeviceSize = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getRoomDeviceSize(param);
    } else {
      window.webkit.messageHandlers.getRoomDeviceSize.postMessage(param);
    }
  };

  // 新风除霾机获取设备名称接口
  this.GetDevCustomData = function(mac, submac, type, callback) {
    var args = [mac, submac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.GetDevCustomData(param);
    } else {
      window.webkit.messageHandlers.GetDevCustomData.postMessage(param);
    }
  };

  // 高泳诗+慕思H5回到格力+的主页面
  this.GoBackMainHome = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.GoBackMainHome(param);
    } else {
      window.webkit.messageHandlers.GoBackMainHome.postMessage(param);
    }
  };

  // 高泳诗+下载音乐
  this.downloadMusic = function(index, callback) {
    var args = [index];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.downloadMusic(param);
    } else {
      window.webkit.messageHandlers.downloadMusic.postMessage(param);
    }
  };

  // 高泳诗+插件点击"现在使用"后，跳转到床垫的配网界面
  this.goToConfigNetWorkForMattress = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.goToConfigNetWorkForMattress(param);
    } else {
      window.webkit.messageHandlers.goToConfigNetWorkForMattress.postMessage(param);
    }
  };

  // 高泳诗+默认界面数据,暂时mac可以随便字符串都可以
  this.getMainPageData = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getMainPageData(param);
    } else {
      window.webkit.messageHandlers.getMainPageData.postMessage(param);
    }
  };

  // 高泳诗+编辑或者创建联动场景
  this.editOrCreateLinkScene = function(json, scene, callback) {
    var args = [json, scene];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.editOrCreateLinkScene(param);
    } else {
      window.webkit.messageHandlers.editOrCreateLinkScene.postMessage(param);
    }
  };

  // 高泳诗+编辑或者创建联动场景
  this.getLinkItemData = function(iid, callback) {
    var args = [iid];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getLinkItemData(param);
    } else {
      window.webkit.messageHandlers.getLinkItemData.postMessage(param);
    }
  };

  // 高泳诗+跳转到场景编辑界面
  this.goToEditScene = function(json, callback) {
    var args = [json];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.goToEditScene(param);
    } else {
      window.webkit.messageHandlers.goToEditScene.postMessage(param);
    }
  };
  // 高泳诗+打开/关闭 智慧睡眠-智能调节playOrPauseMusic
  this.setIntelligenceSwitch = function(opt, callback) {
    var args = [opt];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.setIntelligenceSwitch(param);
    } else {
      window.webkit.messageHandlers.setIntelligenceSwitch.postMessage(param);
    }
  };
  // 高泳诗+打开/关闭 智慧睡眠-联动开关
  this.requestStartLinkTask = function(iid, opt, callback) {
    var args = [iid, opt];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.requestStartLinkTask(param);
    } else {
      window.webkit.messageHandlers.requestStartLinkTask.postMessage(param);
    }
  };

  // 高泳诗+播放或者暂停音乐
  this.playOrPauseMusic = function(opt, callback) {
    var args = [opt];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.playOrPauseMusic(param);
    } else {
      window.webkit.messageHandlers.playOrPauseMusic.postMessage(param);
    }
  };

  // 高泳诗+跳转到音乐播放界面
  this.startSleepMusic = function(index, callback) {
    var args = [index];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.startSleepMusic(param);
    } else {
      window.webkit.messageHandlers.startSleepMusic.postMessage(param);
    }
  };

  // 高泳诗+获取当前家庭里对应的场景列表
  this.getCurrentHomeSceneList = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCurrentHomeSceneList(param);
    } else {
      window.webkit.messageHandlers.getCurrentHomeSceneList.postMessage(param);
    }
  };

  // 高泳诗+播放试听音乐
  this.tryPlaySleepMusic = function(index, needStop, callback) {
    var args = [index, needStop];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.tryPlaySleepMusic(param);
    } else {
      window.webkit.messageHandlers.tryPlaySleepMusic.postMessage(param);
    }
  };

  // 高泳诗+获取播放信息
  this.getPlayStatus = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getPlayStatus(param);
    } else {
      window.webkit.messageHandlers.getPlayStatus.postMessage(param);
    }
  };

  // 新风除霾机存储设备名称接口
  this.SetDevCustomData = function(mac, submac, type, value, callback) {
    var args = [mac, submac, type, value];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.SetDevCustomData(param);
    } else {
      window.webkit.messageHandlers.SetDevCustomData.postMessage(param);
    }
  };

  // 窗帘电机插件控制窗帘开、关、暂停
  this.getCurtainOpenPercent = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCurtainOpenPercent(param);
    } else {
      window.webkit.messageHandlers.getCurtainOpenPercent.postMessage(param);
    }
  };

  // 涂鸦请求设备信息详细信息接口
  this.tuyaRequestDevData = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.tuyaRequestDevData(param);
    } else {
      window.webkit.messageHandlers.tuyaRequestDevData.postMessage(param);
    }
  };

  // 涂鸦请求设备历史记录接口
  this.tuyaGetDevLogs = function(mac, startTime, endTime, logType, logSize, callback) {
    var args = [mac, startTime, endTime, logType, logSize];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.tuyaGetDevLogs(param);
    } else {
      window.webkit.messageHandlers.tuyaGetDevLogs.postMessage(param);
    }
  };

  // 获取涂鸦 温湿度传感器 设备历史记录
  this.getDeviceRegulationLogs = function(devId, startTime, endTime, code, callback) {
    var args = [devId, startTime, endTime, code];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDeviceRegulationLogs(param);
    } else {
      window.webkit.messageHandlers.getDeviceRegulationLogs.postMessage(param);
    }
  };

  // 涂鸦设备更多接口
  this.tuyaDeviceMore = function(mac) {
    var args = [mac];
    var param = { arguments: args, callback: null };
    if (!gt_ios9()) {
      navigator.gree.tuyaDeviceMore(param);
    } else {
      window.webkit.messageHandlers.tuyaDeviceMore.postMessage(param);
    }
  };

  // 涂鸦获取网关下子设备
  this.tuyaGetSubDevListByGateWay = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.tuyaGetSubDevListByGateWay(param);
    } else {
      window.webkit.messageHandlers.tuyaGetSubDevListByGateWay.postMessage(param);
    }
  };

  // 涂鸦控制设备接口
  this.tuyaControlDev = function(mac, type, key, value, callback) {
    var args = [mac, type, key, value];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.tuyaControlDev(param);
    } else {
      window.webkit.messageHandlers.tuyaControlDev.postMessage(param);
    }
  };

  // 涂鸦设备设置定时任务
  this.tuyaSetTimers = function(mac, payload, callback) {
    var args = [mac, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.tuyaSetTimers(param);
    } else {
      window.webkit.messageHandlers.tuyaSetTimers.postMessage(param);
    }
  };

  // 查询涂鸦设备定时任务
  this.tuyaQueryTimerslist = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.tuyaQueryTimerslist(param);
    } else {
      window.webkit.messageHandlers.tuyaQueryTimerslist.postMessage(param);
    }
  };

  // 删除涂鸦设备定时任务
  this.tuyaDeleteTimers = function(mac, payload, callback) {
    var args = [mac, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.tuyaDeleteTimers(param);
    } else {
      window.webkit.messageHandlers.tuyaDeleteTimers.postMessage(param);
    }
  };

  // 编辑涂鸦设备定时任务
  this.tuyaEditTimers = function(mac, payload, callback) {
    var args = [mac, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.tuyaEditTimers(param);
    } else {
      window.webkit.messageHandlers.tuyaEditTimers.postMessage(param);
    }
  };

  // 获取用户抽奖券数量
  this.activityGetUserTickets = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.activityGetUserTickets(param);
    } else {
      window.webkit.messageHandlers.activityGetUserTickets.postMessage(param);
    }
  };
  // 获取中奖记录
  this.activityGetWinHistory = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.activityGetWinHistory(param);
    } else {
      window.webkit.messageHandlers.activityGetWinHistory.postMessage(param);
    }
  };

  // 获取所有人的中奖记录
  this.activityGetAllWinHistory = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.activityGetAllWinHistory(param);
    } else {
      window.webkit.messageHandlers.activityGetAllWinHistory.postMessage(param);
    }
  };

  // 提交抽奖请求
  this.activityTakeLottery = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.activityTakeLottery(param);
    } else {
      window.webkit.messageHandlers.activityTakeLottery.postMessage(param);
    }
  };

  // 获取奖品ID映射关系
  this.activityGetAwardMapping = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.activityGetAwardMapping(param);
    } else {
      window.webkit.messageHandlers.activityGetAwardMapping.postMessage(param);
    }
  };
  // 抽奖插件页跳转到品类页
  this.startCatalogConfigActivity = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.startCatalogConfigActivity(param);
    } else {
      window.webkit.messageHandlers.startCatalogConfigActivity.postMessage(param);
    }
  };

  // 抽奖跳转到商城账户页
  this.toMallUserPage = function(callback) {
    var args = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.toMallUserPage(param);
    } else {
      window.webkit.messageHandlers.toMallUserPage.postMessage(param);
    }
  };

  // 查询云定时 透传接口
  this.getCloudTimerByMac = function(mac, callback) {
    var args = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCloudTimerByMac(param);
    } else {
      window.webkit.messageHandlers.getCloudTimerByMac.postMessage(param);
    }
  };

  // 设置云定时 透传接口
  this.setCloudTimer = function(timerDic, taskDic, callback) {
    var args = [timerDic, taskDic];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.setCloudTimer(param);
    } else {
      window.webkit.messageHandlers.setCloudTimer.postMessage(param);
    }
  };

  // 透传获取云定时信息接口
  this.getCloudTimerInfo = function(timerID, callback) {
    var args = [timerID];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCloudTimerInfo(param);
    } else {
      window.webkit.messageHandlers.getCloudTimerInfo.postMessage(param);
    }
  };

  // 查询云定时 透传接口
  this.modifyCloudTimer = function(timerDic, taskDic, timerID, callback) {
    var args = [timerDic, taskDic, timerID];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: args, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.modifyCloudTimer(param);
    } else {
      window.webkit.messageHandlers.modifyCloudTimer.postMessage(param);
    }
  };
}

Navigator.prototype.PluginInterface = new PluginInterface();
