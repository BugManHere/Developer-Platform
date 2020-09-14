var callBackDict = {};

function getCallBackIdWithCallBack(callback) {
    var my = new Date();
    var callbackId = "Plugins" + parseInt(Math.random() * 1000);
    callBackDict[callbackId] = callback;
    return callbackId;
}

function pluginsInterfaceCallBack(callbackId, param) {
    var callBack = callBackDict[callbackId];
    if (callBack != undefined) {
        callBack(param);
    }
    delete callBackDict[callbackId];
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
        var arguments = [msg, type];
        var param = { "arguments": arguments, "callback": null };
        window.webkit.messageHandlers.showToast.postMessage(param)

    }
    this.editDevice = function(mac) {
        var arguments = [mac];
        var param = { "arguments": arguments, "callback": null }

        window.webkit.messageHandlers.editDevice.postMessage(param);

    }
    this.timerListDevice = function(mac) {
        var arguments = [mac];
        var param = { "arguments": arguments, "callback": null }


        window.webkit.messageHandlers.timerListDevice.postMessage(param);

    }
    this.sendDataToDevice = function(mac, json, isFollowSysVibration, callback) {
        var arguments = [mac, json, isFollowSysVibration];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.sendDataToDevice.postMessage(param);

    }
    this.sendDataToDevicePublic = function(mac, json, isFollowSysVibration, callback) {
        var arguments = [mac, json, isFollowSysVibration];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.sendDataToDevicePublic.postMessage(param);

    }
    this.closePage = function(json) {
        var arguments = [json];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.closePage.postMessage(param);

    }
    this.getCCcmd = function(mac, cmd, remarks, dat) {
        var arguments = [mac, cmd, remarks, dat];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.getCCcmd.postMessage(param);

    }
    this.getInfo = function(mac, callback) {
        var arguments = [mac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getInfo.postMessage(param)

    }
    this.changeBarColor = function(color, callback) {
        var arguments = [color];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.changeBarColor.postMessage(param);

    }
    this.voiceDevice = function(mac) {
        var arguments = [mac];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.voiceDevice.postMessage(param);

    }
    this.updateStates = function(mac, states) {
        var arguments = [mac, states];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.updateStates.postMessage(param);

    }
    this.newPage = function(url, callback) {
        var arguments = [url];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.newPage.postMessage(param);

    }
    this.onCallBack = function(callback) {
        var arguments = [];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.onCallBack.postMessage(param);

    }
    this.showTimePicker = function(type, callback) {
        var arguments = [type];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.showTimePicker.postMessage(param);

    }
    this.showAlert = function(title, msg, callback) {
        var arguments = [title, msg];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.showAlert.postMessage(param);

    }
    this.showConfirm = function(title, msg, callback) {
        var arguments = [title, msg];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.showConfirm.postMessage(param);

    }
    this.showMenuDialog = function(mac, callback) {
        var arguments = [mac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.showMenuDialog.postMessage(param);

    }
    this.addStore = function(mac, key, val, callback) {
        var arguments = [mac, key, val];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.addStore.postMessage(param);

    }
    this.updateStore = function(mac, key, val, callback) {
        var arguments = [mac, key, val];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.updateStore.postMessage(param);

    }
    this.deleteStore = function(mac, key, callback) {
        var arguments = [mac, key];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.deleteStore.postMessage(param);

    }
    this.queryStore = function(mac, key, callback) {
        var arguments = [mac, key];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };
        window.webkit.messageHandlers.queryStore.postMessage(param);

    }
    this.queryAllStore = function(mac, callback) {
        var arguments = [mac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.queryAllStore.postMessage(param);

    }
    this.deleteAllStore = function(mac, callback) {
        var arguments = [mac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.deleteAllStore.postMessage(param);

    }
    this.feedbackCommit = function(mac) {
        var arguments = [mac];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.feedbackCommit.postMessage(param);

    }
    this.startVoice = function(callback) {
        var arguments = [];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.startVoice.postMessage(param);

    }
    this.startSpeak = function(text) {
        var arguments = [text];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.startSpeak.postMessage(param);

    }
    this.stopSpeak = function() {
        var arguments = [];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.stopSpeak.postMessage(param);

    }
    this.translateValue = function(jsonData) {
        var arguments = [jsonData];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.translateValue.postMessage(param);

    }
    this.pluginTranslateData = function(url, jsonData, callback) {
        var arguments = [url, jsonData];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.pluginTranslateData.postMessage(param);

    }
    this.backToHomePage = function() {
        var arguments = [];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.backToHomePage.postMessage(param);

    }
    this.saveUserInfo = function(key, val) {
        var arguments = [key, val];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.saveUserInfo.postMessage(param);

    }
    this.getUserInfo = function(key, val, callback) {
        var arguments = [key, val];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getUserInfo.postMessage(param);

    }
    this.getPluginScript = function(path, callback) {
        var arguments = [path];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getPluginScript.postMessage(param);

    }
    this.startListening = function(callback) {
        var arguments = [];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.startListening.postMessage(param);

    }
    this.sendDataToDeviceNoCallback = function(mac, json, isFollowSysVibration) {
        var arguments = [mac, json, isFollowSysVibration];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.sendDataToDeviceNoCallback.postMessage(param);

    }
    this.sendDataToDeviceDayPublic = function(mac, json, isFollowSysVibration, callback) {
        var arguments = [mac, json, isFollowSysVibration];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.sendDataToDeviceDayPublic.postMessage(param);

    }
    this.pluginHttpPost = function(url, head, body, callback) {
        var arguments = [url, head, body];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.pluginHttpPost.postMessage(param);

    }
    this.getAllTimerList = function(mac, mainMac, callback) {
        var arguments = [mac, mainMac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getAllTimerList.postMessage(param);

    }
    this.getAllSubDevices = function(mac, mainMac, callback) {
        var arguments = [mac, mainMac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getAllSubDevices.postMessage(param);

    }
    this.printLog = function(msg) {
        var arguments = [msg];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.printLog.postMessage(param);

    }
    this.changeStateBarColor = function(color) {
        var arguments = [color];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.changeStateBarColor.postMessage(param);

    }
    this.searchSubBLE = function() {

    }
    this.BLEAddMESH = function() {

    }
    this.BLEDelMESHSubDev = function() {

    }
    this.callNumber = function(tel) {
        var arguments = [tel];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.callNumber.postMessage(param);

    }
    this.toWebPage = function(url, title) {
        var arguments = [url, title];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.toWebPage.postMessage(param);

    }
    this.getCurrentMode = function(callback) {
        var arguments = [];
        var param = { "arguments": arguments, "callback": callback };

        window.webkit.messageHandlers.getCurrentMode.postMessage(param);

    }
    this.sendDataToDevicePublicWithNoHandle = function(mac, json, isFollowSysVibration, callback) {
        var arguments = [mac, json, isFollowSysVibration];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.sendDataToDevicePublicWithNoHandle.postMessage(param);

    }
    this.getElecGenerList = function(mac, type, callback) {
        var arguments = [mac, type];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getElecGenerList.postMessage(param);

    }
    this.getGridConList = function(mac, type, callback) {
        console.log('22222222222222=========');
          var arguments = [mac, type];
          var callbackId = getCallBackIdWithCallBack(callback);
          var param = { "arguments": arguments, "callback": callbackId };
  
          window.webkit.messageHandlers.getGridConList.postMessage(param);
  
      }
      this.getGridConListOneDay = function(mac, type, oneday, callback) {
        console.log('22222222222222=========');
          var arguments = [mac, type, oneday];
          var callbackId = getCallBackIdWithCallBack(callback);
          var param = { "arguments": arguments, "callback": callbackId };
  
          window.webkit.messageHandlers.getGridConListOneDay.postMessage(param);
  
      }
    this.photovoltaicElecStatic = function(mac, callback) {
        var arguments = [mac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.photovoltaicElecStatic.postMessage(param);

    }
    this.getDayUseAndGenerElec = function(mac, callback) {
        var arguments = [mac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getDayUseAndGenerElec.postMessage(param);

    }

    //高泳诗+写入用户自有数据
    this.setUserData = function(key, value, callback) {
        var arguments = [key, value];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };
        if (!gt_ios9()) {
            navigator.gree.setUserData(param);
        } else {
            window.webkit.messageHandlers.setUserData.postMessage(param);
        }
    };

    //高泳诗+读取用户自有数据
    this.getUserData = function(key, callback) {
        var arguments = [key];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };
        if (!gt_ios9()) {
            navigator.gree.getUserData(param);
        } else {
            window.webkit.messageHandlers.getUserData.postMessage(param);
        }
    };

    //高泳诗+蒸烤双能机___获取云菜谱列表
    this.getCloudMenuList = function(mid, index, cnt, callback) {
        var arguments = [mid, index, cnt];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };
        if (!gt_ios9()) {
            navigator.gree.getCloudMenuList(param);
        } else {
            window.webkit.messageHandlers.getCloudMenuList.postMessage(param);
        }
    };

    //高泳诗+蒸烤双能机___获取云菜单
    this.searchCloudMenu = function(keyword, mid, index, cnt, callback) {
        var arguments = [keyword, mid, index, cnt];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };
        if (!gt_ios9()) {
            navigator.gree.searchCloudMenu(param);
        } else {
            window.webkit.messageHandlers.searchCloudMenu.postMessage(param);
        }
    };

    //高泳诗+蒸烤双能机___获取云菜单详细步骤
    this.getCloudMenuDetailSteps = function(cid, callback) {
        var arguments = [cid];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };
        if (!gt_ios9()) {
            navigator.gree.getCloudMenuDetailSteps(param);
        } else {
            window.webkit.messageHandlers.getCloudMenuDetailSteps.postMessage(param);
        }
    };
    
    this.tuyaRequestDevData = function(mac, callback) {
        var arguments = [mac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.tuyaRequestDevData.postMessage(param);

    }
    this.tuyaGetDevLogs = function(mac, callback) {
        var arguments = [mac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.tuyaGetDevLogs.postMessage(param);

    }
    this.finishLoad = function() {
        var arguments = [];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.finishLoad.postMessage(param);

    }

    this.tuyaDeviceMore = function(mac) {
        var arguments = [mac];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.tuyaDeviceMore.postMessage(param);

    }

    this.getMsgRequest = function(mac, callback) {
        var arguments = [mac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getMsgRequest.postMessage(param);
    }

    this.tuyaGetSubDevListByGateWay = function(mac, callback) {
        var arguments = [mac];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.tuyaGetSubDevListByGateWay.postMessage(param);

    }

    this.tuyaZigbeeDevSelectPage = function(mac) {
        var arguments = [mac];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.tuyaZigbeeDevSelectPage.postMessage(param);
    }

    this.tuyaGetDeviceLogs = function(mac, logStartTime, logEndTime, callback) {
        var arguments = [mac, logStartTime, logEndTime];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.tuyaGetDevLogs.postMessage(param);
    }

    this.tuyaControlDev = function(mac, key, value, callback) {
        var arguments = [mac, key, value];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.tuyaControlDev.postMessage(param);
    }
    this.getDerucciGetLadyInfo = function(mac, key, callback) {
        var arguments = [mac, key];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getDerucciGetLadyInfo.postMessage(param);
    }
    this.getDerucciGetBedStatus = function(mac, key, callback) {
        var arguments = [mac, key];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getDerucciGetBedStatus.postMessage(param);
    }
    this.getDerucciGetSleepData = function(mac, key, callback) {
        var arguments = [mac, key];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getDerucciGetSleepData.postMessage(param);
    }
    this.getDerucciGetDateList = function(mac, key, callback) {
        var arguments = [mac, key];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getDerucciGetDateList.postMessage(param);
    },
    this.getDerucciWeekList = function(mac, key, callback) {
        var arguments = [mac, key];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getDerucciWeekList.postMessage(param);
    },
    this.getDerucciGetSleepAllData = function(mac, key, callback) {
        var arguments = [mac, key];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getDerucciGetSleepAllData.postMessage(param);
    },
    this.getDerucciUserInformation = function(callback) {
        var arguments = [];
        var callbackId = getCallBackIdWithCallBack(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getDerucciUserInformation.postMessage(param);
    },
    this.getDevRealTimeFault = function(index, callback) {
        var arguments = [index];
        var callbackId = getDevRealTimeFault(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.getDevRealTimeFault.postMessage(param);
    },
    this.startVoiceMainActivity = function(mac) {
        var arguments = [mac];
        var param = { "arguments": arguments, "callback": null };

        window.webkit.messageHandlers.startVoiceMainActivity.postMessage(param);
    },
    this.clearHistoricalPhotovoltaicPowerData = function(mac, callback) {
        var arguments = [mac];
        var callbackId = clearHistoricalPhotovoltaicPowerData(callback);
        var param = { "arguments": arguments, "callback": callbackId };

        window.webkit.messageHandlers.clearHistoricalPhotovoltaicPowerData.postMessage(param);
    },
}

Navigator.prototype.PluginInterface = new PluginInterface();