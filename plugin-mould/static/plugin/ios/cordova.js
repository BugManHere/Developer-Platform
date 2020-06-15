var callBackDict = {};

function getCallBackIdWithCallBack (callback) {
  var my = new Date();
  var callbackId = 'Plugins' + my.getTime() + parseInt(Math.random() * 1000);
  callBackDict[callbackId] = callback;
  return callbackId;
}

function pluginsInterfaceCallBack (callbackId, param) {
  var callBack = callBackDict[callbackId];
  if (callBack != undefined) {
    callBack(param);
  }
  delete callBackDict[callbackId];
}

function gt_ios9 () {
  var ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
  ver = parseInt(ver[1], 10);
  if (ver >= 9) {
    return true;
  } else {
    return false;
  }
}

function PluginInterface () {

  this.showToast = function (msg, type) {
    var arguments = [msg, type];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.showToast(param);
    } else {
      window.webkit.messageHandlers.showToast.postMessage(param);
    }
  };

  this.editDevice = function (mac) {
    var arguments = [mac];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.editDevice(param);
    } else {
      window.webkit.messageHandlers.editDevice.postMessage(param);
    }
  };

  this.startVoiceMainActivity = function (mac) {
    var arguments = [mac];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.startVoiceMainActivity(param);
    } else {
      window.webkit.messageHandlers.startVoiceMainActivity.postMessage(param);
    }
  };

  this.timerListDevice = function (mac) {
    var arguments = [mac];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.timerListDevice(param);
    } else {
      window.webkit.messageHandlers.timerListDevice.postMessage(param);
    }
  };

  this.sendDataToDevice = function (mac, json, isFollowSysVibration, callback) {
    var arguments = [mac, json, isFollowSysVibration];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.sendDataToDevice(param);
    } else {
      window.webkit.messageHandlers.sendDataToDevice.postMessage(param);
    }
  };

  this.sendDataToDevicePublic = function (
    mac,
    json,
    isFollowSysVibration,
    callback
  ) {
    var arguments = [mac, json, isFollowSysVibration];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.sendDataToDevicePublic(param);
    } else {
      window.webkit.messageHandlers.sendDataToDevicePublic.postMessage(param);
    }
  };

  this.closePage = function (json) {
    var arguments = [json];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.closePage(param);
    } else {
      window.webkit.messageHandlers.closePage.postMessage(param);
    }
  };

  this.getCCcmd = function (mac, cmd, remarks, dat) {
    var arguments = [mac, cmd, remarks, dat];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.getCCcmd(param);
    } else {
      window.webkit.messageHandlers.getCCcmd.postMessage(param);
    }
  };

  this.getInfo = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getInfo(param);
    } else {
      window.webkit.messageHandlers.getInfo.postMessage(param);
    }
  };

  this.changeBarColor = function (color, callback) {
    var arguments = [color];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.changeBarColor(param);
    } else {
      window.webkit.messageHandlers.changeBarColor.postMessage(param);
    }
  };

  this.voiceDevice = function (mac) {
    var arguments = [mac];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.voiceDevice(param);
    } else {
      window.webkit.messageHandlers.voiceDevice.postMessage(param);
    }
  };

  this.updateStates = function (mac, states) {
    var arguments = [mac, states];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.updateStates(param);
    } else {
      window.webkit.messageHandlers.updateStates.postMessage(param);
    }
  };

  this.newPage = function (url, callback) {
    var arguments = [url];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.newPage(param);
    } else {
      window.webkit.messageHandlers.newPage.postMessage(param);
    }
  };

  this.onCallBack = function (callback) {
    var arguments = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.onCallBack(param);
    } else {
      window.webkit.messageHandlers.onCallBack.postMessage(param);
    }
  };

  this.showTimePicker = function (type, callback) {
    var arguments = [type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.showTimePicker(param);
    } else {
      window.webkit.messageHandlers.showTimePicker.postMessage(param);
    }
  };

  this.showAlert = function (title, msg, callback) {
    var arguments = [title, msg];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.showAlert(param);
    } else {
      window.webkit.messageHandlers.showAlert.postMessage(param);
    }
  };

  this.showConfirm = function (title, msg, callback) {
    var arguments = [title, msg];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.showConfirm(param);
    } else {
      window.webkit.messageHandlers.showConfirm.postMessage(param);
    }
  };

  this.showMenuDialog = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.showMenuDialog(param);
    } else {
      window.webkit.messageHandlers.showMenuDialog.postMessage(param);
    }
  };

  this.addStore = function (mac, key, val, callback) {
    var arguments = [mac, key, val];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.addStore(param);
    } else {
      window.webkit.messageHandlers.addStore.postMessage(param);
    }
  };

  this.updateStore = function (mac, key, val, callback) {
    var arguments = [mac, key, val];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.updateStore(param);
    } else {
      window.webkit.messageHandlers.updateStore.postMessage(param);
    }
  };

  this.deleteStore = function (mac, key, callback) {
    var arguments = [mac, key];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.deleteStore(param);
    } else {
      window.webkit.messageHandlers.deleteStore.postMessage(param);
    }
  };

  this.queryStore = function (mac, key, callback) {
    var arguments = [mac, key];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.queryStore(param);
    } else {
      window.webkit.messageHandlers.queryStore.postMessage(param);
    }
  };

  this.queryAllStore = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.queryAllStore(param);
    } else {
      window.webkit.messageHandlers.queryAllStore.postMessage(param);
    }
  };

  this.deleteAllStore = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.deleteAllStore(param);
    } else {
      window.webkit.messageHandlers.deleteAllStore.postMessage(param);
    }
  };

  this.feedbackCommit = function (mac) {
    var arguments = [mac];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.feedbackCommit(param);
    } else {
      window.webkit.messageHandlers.feedbackCommit.postMessage(param);
    }
  };

  this.startVoice = function (callback) {
    var arguments = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.startVoice(param);
    } else {
      window.webkit.messageHandlers.startVoice.postMessage(param);
    }
  };

  this.startSpeak = function (text) {
    var arguments = [text];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.startSpeak(param);
    } else {
      window.webkit.messageHandlers.startSpeak.postMessage(param);
    }
  };

  this.stopSpeak = function () {
    var arguments = [];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.stopSpeak(param);
    } else {
      window.webkit.messageHandlers.stopSpeak.postMessage(param);
    }
  };

  this.translateValue = function (jsonData) {
    var arguments = [jsonData];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.translateValue(param);
    } else {
      window.webkit.messageHandlers.translateValue.postMessage(param);
    }
  };

  this.pluginTranslateData = function (url, jsonData, callback) {
    var arguments = [url, jsonData];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.pluginTranslateData(param);
    } else {
      window.webkit.messageHandlers.pluginTranslateData.postMessage(param);
    }
  };

  this.backToHomePage = function () {
    var arguments = [];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.backToHomePage(param);
    } else {
      window.webkit.messageHandlers.backToHomePage.postMessage(param);
    }
  };

  this.saveUserInfo = function (key, val) {
    var arguments = [key, val];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.saveUserInfo(param);
    } else {
      window.webkit.messageHandlers.saveUserInfo.postMessage(param);
    }
  };

  this.getUserInfo = function (key, val, callback) {
    var arguments = [key, val];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getUserInfo(param);
    } else {
      window.webkit.messageHandlers.getUserInfo.postMessage(param);
    }
  };

  this.getPluginScript = function (path, callback) {
    var arguments = [path];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getPluginScript(param);
    } else {
      window.webkit.messageHandlers.getPluginScript.postMessage(param);
    }
  };

  this.startListening = function (callback) {
    var arguments = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.startListening(param);
    } else {
      window.webkit.messageHandlers.startListening.postMessage(param);
    }
  };

  this.sendDataToDeviceNoCallback = function (mac, json, isFollowSysVibration) {
    var arguments = [mac, json, isFollowSysVibration];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.sendDataToDeviceNoCallback(param);
    } else {
      window.webkit.messageHandlers.sendDataToDeviceNoCallback.postMessage(
        param
      );
    }
  };

  this.sendDataToDeviceDayPublic = function (
    mac,
    json,
    isFollowSysVibration,
    callback
  ) {
    var arguments = [mac, json, isFollowSysVibration];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.sendDataToDeviceDayPublic(param);
    } else {
      window.webkit.messageHandlers.sendDataToDeviceDayPublic.postMessage(
        param
      );
    }
  };

  this.pluginHttpPost = function (url, head, body, callback) {
    var arguments = [url, head, body];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.pluginHttpPost(param);
    } else {
      window.webkit.messageHandlers.pluginHttpPost.postMessage(param);
    }
  };

  this.getAllTimerList = function (mac, mainMac, callback) {
    var arguments = [mac, mainMac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getAllTimerList(param);
    } else {
      window.webkit.messageHandlers.getAllTimerList.postMessage(param);
    }
  };

  this.getAllSubDevices = function (mac, mainMac, callback) {
    var arguments = [mac, mainMac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getAllSubDevices(param);
    } else {
      window.webkit.messageHandlers.getAllSubDevices.postMessage(param);
    }
  };

  this.printLog = function (msg) {
    var arguments = [msg];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.printLog(param);
    } else {
      window.webkit.messageHandlers.printLog.postMessage(param);
    }
  };

  this.finishLoad = function () {
    var arguments = [];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.finishLoad(param);
    } else {
      window.webkit.messageHandlers.finishLoad.postMessage(param);
    }
  };

  this.callNumber = function (tel) {
    var arguments = [tel];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.callNumber(param);
    } else {
      window.webkit.messageHandlers.callNumber.postMessage(param);
    }
  };

  this.toWebPage = function (url, title) {
    var arguments = [url, title];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.toWebPage(param);
    } else {
      window.webkit.messageHandlers.toWebPage.postMessage(param);
    }
  };

  this.startVoice2 = function (text, callback) {
    var arguments = [text];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.startVoice2(param);
    } else {
      window.webkit.messageHandlers.startVoice2.postMessage(param);
    }
  };

  this.showLoading = function () {
    var arguments = [];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.showLoading(param);
    } else {
      window.webkit.messageHandlers.showLoading.postMessage(param);
    }
  };

  this.hideLoading = function () {
    var arguments = [];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.hideLoading(param);
    } else {
      window.webkit.messageHandlers.hideLoading.postMessage(param);
    }
  };

  this.getCurrentMode = function (callback) {
    var arguments = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCurrentMode(param);
    } else {
      window.webkit.messageHandlers.getCurrentMode.postMessage(param);
    }
  };

  this.sendDataToDevicebyPower = function (
    mac,
    json,
    isFollowSysVibration,
    callback
  ) {
    var arguments = [mac, json, isFollowSysVibration];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.sendDataToDevicebyPower(param);
    } else {
      window.webkit.messageHandlers.sendDataToDevicebyPower.postMessage(param);
    }
  };

  this.faceControl = function (mac, did) {
    var arguments = [mac, did];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.faceControl(param);
    } else {
      window.webkit.messageHandlers.faceControl.postMessage(param);
    }
  };

  this.securityControl = function (mac, did) {
    var arguments = [mac, did];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.securityControl(param);
    } else {
      window.webkit.messageHandlers.securityControl.postMessage(param);
    }
  };

  // lucasjunjie
  this.placetroopsControl = function (mac, did) {
    var arguments = [mac, did];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.placetroopsControl(param);
    } else {
      window.webkit.messageHandlers.placetroopsControl.postMessage(param);
    }
  };

  // 海拔
  this.getSeaHeight = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getSeaHeight(param);
    } else {
      window.webkit.messageHandlers.getSeaHeight.postMessage(param);
    }
  };

  // 离线弹框
  this.showOfflineAlertView = function () {
    var arguments = [];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.showOfflineAlertView(param);
    } else {
      window.webkit.messageHandlers.showOfflineAlertView.postMessage(param);
    }
  };

  // 获取光伏空调当日用电/发电量统计数据
  this.getDayUseAndGenerElec = function (mac, oneday, callback) {
    var arguments = [mac, oneday];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDayUseAndGenerElec(param);
    } else {
      window.webkit.messageHandlers.getDayUseAndGenerElec.postMessage(param);
    }
  };

  // 获取光伏空调发电量统计数据
  this.getElecGenerList = function (mac, type, oneday, callback) {
    var arguments = [mac, type, oneday];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getElecGenerList(param);
    } else {
      window.webkit.messageHandlers.getElecGenerList.postMessage(param);
    }
  };

  // 获取光伏空调用电统计数据
  this.getGridConList = function (mac, type, callback) {
    var arguments = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getGridConList(param);
    } else {
      window.webkit.messageHandlers.getGridConList.postMessage(param);
    }
  };

  // 获取光伏空调用电统计数据（带参数）
  this.getGridConListOneDay = function (mac, type, oneday, callback) {
    var arguments = [mac, type, oneday];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getGridConListOneDay(param);
    } else {
      window.webkit.messageHandlers.getGridConListOneDay.postMessage(param);
    }
  };

  // 清除普通空调历史电量数据
  this.clearHistoricalPowerData = function (mac, type, callback) {
    var arguments = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.clearHistoricalPowerData(param);
    } else {
      window.webkit.messageHandlers.clearHistoricalPowerData.postMessage(param);
    }
  };

  // 高泳诗+写入用户自有数据
  this.setUserData = function (key, value, callback) {
    var arguments = [key, value];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.setUserData(param);
    } else {
      window.webkit.messageHandlers.setUserData.postMessage(param);
    }
  };

  // 高泳诗+读取用户自有数据
  this.getUserData = function (key, callback) {
    var arguments = [key];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getUserData(param);
    } else {
      window.webkit.messageHandlers.getUserData.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___获取云菜谱列表
  this.getCloudMenuList = function (mid, index, cnt, callback) {
    var arguments = [mid, index, cnt];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCloudMenuList(param);
    } else {
      window.webkit.messageHandlers.getCloudMenuList.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___搜索一日三餐推荐菜谱
  this.getRecommendedMenu = function (callback) {
    var arguments = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getRecommendedMenu(param);
    } else {
      window.webkit.messageHandlers.getRecommendedMenu.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___添加菜谱到菜篮子
  this.addDishToBasket = function (addDatas, callback) {
    var arguments = [addDatas];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.addDishToBasket(param);
    } else {
      window.webkit.messageHandlers.addDishToBasket.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___从菜篮子里移除菜谱
  this.removeDishFromBasket = function (idsArr, callback) {
    var arguments = [idsArr];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.removeDishFromBasket(param);
    } else {
      window.webkit.messageHandlers.removeDishFromBasket.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___获取菜篮子列表
  this.getDishFromBasket = function (callback) {
    var arguments = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDishFromBasket(param);
    } else {
      window.webkit.messageHandlers.getDishFromBasket.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___长按监听震动
  this.longClickListenerVibrator = function () {
    var arguments = [];
    var param = { arguments: arguments, callback: null };
    if (!gt_ios9()) {
      navigator.gree.longClickListenerVibrator(param);
    } else {
      window.webkit.messageHandlers.longClickListenerVibrator.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___获取云菜单
  this.searchCloudMenu = function (keyword, mid, index, cnt, callback) {
    var arguments = [keyword, mid, index, cnt];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.searchCloudMenu(param);
    } else {
      window.webkit.messageHandlers.searchCloudMenu.postMessage(param);
    }
  };

  // 高泳诗+蒸烤双能机___获取云菜单详细步骤
  this.getCloudMenuDetailSteps = function (cid, callback) {
    var arguments = [cid];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCloudMenuDetailSteps(param);
    } else {
      window.webkit.messageHandlers.getCloudMenuDetailSteps.postMessage(param);
    }
  };

  // 高泳诗+红外1
  this.addDefineOfLearningResult = function (mac, opt, p, callback) {
    var arguments = [mac, opt, p];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.addDefineOfLearningResult(param);
    } else {
      window.webkit.messageHandlers.addDefineOfLearningResult.postMessage(
        param
      );
    }
  };

  // 高泳诗+红外2
  this.delDefineOfLearningResult = function (mac, defineIds, callback) {
    var arguments = [mac, defineIds];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.delDefineOfLearningResult(param);
    } else {
      window.webkit.messageHandlers.delDefineOfLearningResult.postMessage(
        param
      );
    }
  };

  // 高泳诗+红外3
  this.getDefineOfLearningResultList = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDefineOfLearningResultList(param);
    } else {
      window.webkit.messageHandlers.getDefineOfLearningResultList.postMessage(
        param
      );
    }
  };

  // 高泳诗+欧瑞博
  this.greeSmartHome = function (mac, type, callback) {
    var arguments = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.greeSmartHome(param);
    } else {
      window.webkit.messageHandlers.greeSmartHome.postMessage(param);
    }
  };

  // 高泳诗+欧瑞博给插件查询设备所有状态的接口
  this.getOuriboDevicesAllStatus = function (mac, type, callback) {
    var arguments = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getOuriboDevicesAllStatus(param);
    } else {
      window.webkit.messageHandlers.getOuriboDevicesAllStatus.postMessage(
        param
      );
    }
  };

  // 高泳诗+欧瑞博给插件RGB灯带控制颜色
  this.setLightBeltControl = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.setLightBeltControl(param);
    } else {
      window.webkit.messageHandlers.setLightBeltControl.postMessage(param);
    }
  };

  // 高泳诗+欧瑞博+格力云绑定
  this.bindThirdPartyDev = function (mac, type, callback) {
    var arguments = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.bindThirdPartyDev(param);
    } else {
      window.webkit.messageHandlers.bindThirdPartyDev.postMessage(param);
    }
  };

  // 高泳诗+欧瑞博+格力云解绑
  this.unbindHomeThirdPartyDev = function (mac, type, callback) {
    var arguments = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.unbindHomeThirdPartyDev(param);
    } else {
      window.webkit.messageHandlers.unbindHomeThirdPartyDev.postMessage(param);
    }
  };

  // 获取普通空调用电统计数据
  this.getElecPowerConsumList = function (mac, type, callback) {
    var arguments = [mac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getElecPowerConsumList(param);
    } else {
      window.webkit.messageHandlers.getElecPowerConsumList.postMessage(param);
    }
  };

  // 清除光伏空调历史电量数据
  this.clearHistoricalPhotovoltaicPowerData = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.clearHistoricalPhotovoltaicPowerData(param);
    } else {
      window.webkit.messageHandlers.clearHistoricalPhotovoltaicPowerData.postMessage(
        param
      );
    }
  };

  // 蓝牙接口
  this.connectBleDevice = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.connectBleDevice(param);
    } else {
      window.webkit.messageHandlers.connectBleDevice.postMessage(param);
    }
  };

  // 网关接口
  this.connectBleSubDevice = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.connectBleSubDevice(param);
    } else {
      window.webkit.messageHandlers.connectBleSubDevice.postMessage(param);
    }
  };

  this.getGatewayDevList = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getGatewayDevList(param);
    } else {
      window.webkit.messageHandlers.getGatewayDevList.postMessage(param);
    }
  };

  this.addBleSubDevice = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.addBleSubDevice(param);
    } else {
      window.webkit.messageHandlers.addBleSubDevice.postMessage(param);
    }
  };

  this.startPlugin = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.startPlugin(param);
    } else {
      window.webkit.messageHandlers.startPlugin.postMessage(param);
    }
  };

  // 传当前房间设备的个数给环境感知器 by朱运发
  this.getRoomDeviceSize = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getRoomDeviceSize(param);
    } else {
      window.webkit.messageHandlers.getRoomDeviceSize.postMessage(param);
    }
  };

  // 新风除霾机获取设备名称接口
  this.GetDevCustomData = function (mac, submac, type, callback) {
    var arguments = [mac, submac, type];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.GetDevCustomData(param);
    } else {
      window.webkit.messageHandlers.GetDevCustomData.postMessage(param);
    }
  };

  // 高泳诗+慕思H5回到格力+的主页面
  this.GoBackMainHome = function (callback) {
    var arguments = [];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.GoBackMainHome(param);
    } else {
      window.webkit.messageHandlers.GoBackMainHome.postMessage(param);
    }
  };

  // 高泳诗+慕思获取查询T10实时数据
  this.getDerucciGetBedStatus = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetBedStatus(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetBedStatus.postMessage(param);
    }
  };

  // 高泳诗+慕思保存或修改女性生理信息
  this.getDerucciLadyInfo = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciLadyInfo(param);
    } else {
      window.webkit.messageHandlers.getDerucciLadyInfo.postMessage(param);
    }
  };

  // 高泳诗+慕思获取女性生理信息
  this.getDerucciGetLadyInfo = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetLadyInfo(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetLadyInfo.postMessage(param);
    }
  };

  // 高泳诗+慕思获取睡眠报告
  this.getDerucciGetSleepData = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetSleepData(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetSleepData.postMessage(param);
    }
  };

  // 高泳诗+慕思获取睡眠历史的日期列表
  this.getDerucciGetDateList = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetDateList(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetDateList.postMessage(param);
    }
  };

  // 高泳诗+慕思获取控制T10软硬度接口
  this.getDerucciSetPressure = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciSetPressure(param);
    } else {
      window.webkit.messageHandlers.getDerucciSetPressure.postMessage(param);
    }
  };

  // 高泳诗+慕思获取控制T10自动补气时间
  this.getDerucciSetTime = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciSetTime(param);
    } else {
      window.webkit.messageHandlers.getDerucciSetTime.postMessage(param);
    }
  };

  // 高泳诗+慕思T10软硬度精准推荐
  this.getDerucciGetRecommendData = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetRecommendData(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetRecommendData.postMessage(
        param
      );
    }
  };

  // 高泳诗+慕思周、月睡眠报告补充字段
  this.getDerucciWeekList = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciWeekList(param);
    } else {
      window.webkit.messageHandlers.getDerucciWeekList.postMessage(param);
    }
  };

  // 高泳诗+慕思T10智能模式配置接口
  this.getDerucciSmartConfig = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciSmartConfig(param);
    } else {
      window.webkit.messageHandlers.getDerucciSmartConfig.postMessage(param);
    }
  };

  // 高泳诗+慕思T10获取当前配置参数接口
  this.getDerucciGetSmartConfig = function (endpointId, payload, callback) {
    var arguments = [endpointId, payload];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getDerucciGetSmartConfig(param);
    } else {
      window.webkit.messageHandlers.getDerucciGetSmartConfig.postMessage(param);
    }
  };

  // 新风除霾机存储设备名称接口
  this.SetDevCustomData = function (mac, submac, type, value, callback) {
    var arguments = [mac, submac, type, value];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.SetDevCustomData(param);
    } else {
      window.webkit.messageHandlers.SetDevCustomData.postMessage(param);
    }
  };

  // 窗帘电机插件控制窗帘开、关、暂停
  this.getCurtainOpenPercent = function (mac, callback) {
    var arguments = [mac];
    var callbackId = getCallBackIdWithCallBack(callback);
    var param = { arguments: arguments, callback: callbackId };
    if (!gt_ios9()) {
      navigator.gree.getCurtainOpenPercent(param);
    } else {
      window.webkit.messageHandlers.getCurtainOpenPercent.postMessage(param);
    }
  };

}

  // 语音技能接口
  this.startVoiceMainActivity = function(mac) {
    var arguments = [mac];
    var param = { "arguments": arguments, "callback": null };
    if (!gt_ios9()) {
      navigator.gree.startVoiceMainActivity(param);
    } else {
      window.webkit.messageHandlers.startVoiceMainActivity.postMessage(param);
    }
  },

  // 电量统计
  this.getGridConList = function(mac, type, callback) {
    console.log('22222222222222=========');
      var arguments = [mac, type];
      var callbackId = getCallBackIdWithCallBack(callback);
      var param = { "arguments": arguments, "callback": callbackId };

      window.webkit.messageHandlers.getGridConList.postMessage(param);

  }

Navigator.prototype.PluginInterface = new PluginInterface();
