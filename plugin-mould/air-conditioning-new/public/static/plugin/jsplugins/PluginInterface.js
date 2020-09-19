// eslint-disable-next-line no-undef
cordova.define('com.gree.codovaplugin.PluginInterface', function (require, exports, module) {
  var exec = require('cordova/exec');
  module.exports = {
      /**
       * Toast提示
       * @param {string} msg
       * @param {number} type
       */
      showToast: function (msg, type) {
          exec(null, null, 'PluginInterface', 'showToast', [msg, type]);
      },
      // 跳转到设备编辑页
      editDevice: function (mac) {
          exec(null, null, 'PluginInterface', 'editDevice', [mac]);
      },
      // 跳转到设备配网页面（配网activity）
      startCatalogConfigActivity: function () {
          exec(null, null, 'PluginInterface', 'startCatalogConfigActivity', []);
      },
      // 跳转到设备预约页
      timerListDevice: function (mac) {
          exec(null, null, 'PluginInterface', 'timerListDevice', [mac]);
      },
      // 影子设备项目中，提供回调让App主动传递变更的数据给插件页
      setMqttStatusCallback: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'setMqttStatusCallback', [mac]);
      },
      // 发送json数据给设备
      sendDataToDevice: function (mac, json, isFollowSysVibration, callback) {
          exec(callback, null, 'PluginInterface', 'sendDataToDevice', [mac, json, isFollowSysVibration]);
      },
      // 发送json数据到设备 公钥解密
      sendDataToDevicePublic: function (mac, json, isFollowSysVibration, callback) {
          exec(callback, null, 'PluginInterface', 'sendDataToDevicePublic', [mac, json, isFollowSysVibration]);
      },
      // 发送json到设备 公钥解密
      sendDataToDeviceDayPublic: function (mac, json, isFollowSysVibration, callback) {
          exec(callback, null, 'PluginInterface', 'sendDataToDeviceDayPublic', [mac, json, isFollowSysVibration]);
      },
      // 关闭H5(WebView)页面
      closePage: function (result) {
          exec(null, null, 'PluginInterface', 'closePage', [result]);
      },
      // 调用主体场景功能
      getCCcmd: function (mac, cmd, remarks, dat) {
          exec(null, null, 'PluginInterface', 'getCCcmd', [mac, cmd, remarks, dat]);
      },
      // 获取设备查询字段以及查看设备是否在线
      getInfo: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getInfo', [mac]);
      },
      // 改变标题栏颜色（空字符串时不改变颜色）
      changeBarColor: function (color, callback) {
          exec(callback, null, 'PluginInterface', 'changeBarColor', [color]);
      },
      // 2.0已废弃，不需要此接口
      voiceDevice: function (mac) {
          exec(null, null, 'PluginInterface', 'voiceDevice', [mac]);
      },
      // 更新H5页面中的状态信息给主体
      updateStates: function (mac, states, callback) {
          exec(callback, null, 'PluginInterface', 'updateStates', [mac, states]);
      },
      // 打开新页面
      newPage: function (url, callback) {
          exec(callback, null, 'PluginInterface', 'newPage', [url]);
      },
      // Cordova初始化成功后回调
      onCallBack: function (callback) {
          exec(callback, null, 'PluginInterface', 'onCallBack', []);
      },
      // 日期时间选择Dialog
      showTimePicker: function (type, callback) {
          exec(callback, null, 'PluginInterface', 'showTimePicker', [type]);
      },
      // 弹出提示对话框
      showAlert: function (title, msg, callback) {
          exec(callback, null, 'PluginInterface', 'showAlert', [title, msg]);
      },
      // 弹出确认对话框
      showConfirm: function (title, msg, callback) {
          exec(callback, null, 'PluginInterface', 'showConfirm', [title, msg]);
      },
      // 拍照、选择图片对话框
      showMenuDialog: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'showMenuDialog', [mac]);
      },
      // 添加储存数据
      addStore: function (mac, key, val, callback) {
          exec(callback, null, 'PluginInterface', 'addStore', [mac, key, val]);
      },
      // 更新储存数据
      updateStore: function (mac, key, val, callback) {
          exec(callback, null, 'PluginInterface', 'updateStore', [mac, key, val]);
      },
      // 删除储存数据
      deleteStore: function (mac, key, callback) {
          exec(callback, null, 'PluginInterface', 'deleteStore', [mac, key]);
      },
      // 查询储存数据
      queryStore: function (mac, key, callback) {
          exec(callback, null, 'PluginInterface', 'queryStore', [mac, key]);
      },
      // 查询全部数据
      queryAllStore: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'queryAllStore', [mac]);
      },
      // 删除全部储存数据
      deleteAllStore: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'deleteAllStore', [mac]);
      },
      // 反馈接口
      feedbackCommit: function (mac) {
          exec(null, null, 'PluginInterface', 'feedbackCommit', [mac]);
      },
      // 弹出语音监听Dialog
      startVoice: function (callback) {
          exec(callback, null, 'PluginInterface', 'startVoice', []);
      },
      // 开始播报
      startSpeak: function (text) {
          exec(null, null, 'PluginInterface', 'startSpeak', [text]);
      },
      // 结束播报
      stopSpeak: function () {
          exec(null, null, 'PluginInterface', 'stopSpeak', []);
      },
      // 发送给设备的json字段跟机型相关
      translateValue: function (jsonData) {
          exec(null, null, 'PluginInterface', 'translateValue', [jsonData]);
      },
      // 冰箱食材
      pluginTranslateData: function (url, jsonData, callback) {
          exec(callback, null, 'PluginInterface', 'pluginTranslateData', [url, jsonData]);
      },
      // 保存用户信息
      saveUserInfo: function (key, value) {
          exec(null, null, 'PluginInterface', 'saveUserInfo', [key, value]);
      },
      // 获取用户信息
      getUserInfo: function (key, value, callback) {
          exec(callback, null, 'PluginInterface', 'getUserInfo', [key, value]);
      },
      // 跳转到主界面
      backToHomePage: function () {
          exec(null, null, 'PluginInterface', 'backToHomePage', []);
      },
      // 发送json到设备
      sendDataToDeviceNoCallback: function (mac, json, isFollowSysVibration) {
          exec(null, null, 'PluginInterface', 'sendDataToDeviceNoCallback', [mac, json, isFollowSysVibration]);
      },
      // post方式http接口
      pluginHttpPost: function (url, headersStr, paramsStr, callback) {
          exec(callback, null, 'PluginInterface', 'pluginHttpPost', [url, headersStr, paramsStr]);
      },
      // http接口: 各种兼容方式，具体看接口文档
      pluginHttp: function (url, hearders, params, method, platform, extraParams, callback) {
          exec(callback, null, 'PluginInterface', 'pluginHttpPost', [url, hearders, params, method, platform, extraParams]);
      },
      //  开始语音监听无UI
      startListening: function (callback) {
          exec(callback, null, 'PluginInterface', 'startListening', []);
      },
      // 添加存储数据（数组）
      addStoreList: function (val, callback) {
          exec(callback, null, 'PluginInterface', 'addStoreList', [val]);
      },
      // 多联机获取主设备全部预约
      getAllTimerList: function (subMac, mainMac, callback) {
          exec(callback, null, 'PluginInterface', 'getAllTimerList', [subMac, mainMac]);
      },
      // 多联机获取子设备列表
      getAllSubDevices: function (subMac, mainMac, callback) {
          exec(callback, null, 'PluginInterface', 'getAllSubDevices', [subMac, mainMac]);
      },
      // 结束Loading
      finishLoad: function () {
          exec(null, null, 'PluginInterface', 'finishLoad', []);
      },
      // BLE网关搜索周围的蓝牙设备
      searchSubBLE: function (isStart, mac, callback) {
          exec(callback, null, 'PluginInterface', 'searchSubBLE', [isStart, mac]);
      },
      // 蓝牙组网
      BLEAddMESH: function (mac, subCount, hashList, callback) {
          exec(callback, null, 'PluginInterface', 'BLEAddMESH', [mac, subCount, hashList]);
      },
      // 删除蓝牙子设备
      BLEDelMESHSubDev: function (mac, subCount, hashList, callback) {
          exec(callback, null, 'PluginInterface', 'BLEDelMESHSubDev', [mac, subCount, hashList]);
      },
      // 体检电量
      sendDataToDevicebyPower: function (mac, json, isFollowSysVibration, callback) {
          exec(callback, null, 'PluginInterface', 'sendDataToDevicebyPower', [mac, json, isFollowSysVibration]);
      },
      // 拨打电话
      callNumber: function (num) {
          exec(null, null, 'PluginInterface', 'callNumber', [num]);
      },
      // 跳转webView
      toWebPage: function (url, title) {
          exec(null, null, 'PluginInterface', 'toWebPage', [url, title]);
      },
      // 第三方请求
      thirdPlatformRequest: function (json, url, callback) {
          exec(callback, null, 'PluginInterface', 'thirdPlatformRequest', [json, url]);
      },
      // 获取插件是否debug模式
      getCurrentMode: function (callback) {
          exec(callback, null, 'PluginInterface', 'getCurrentMode', []);
      },
      // 显示阻塞加载Loading
      showLoading: function () {
          exec(null, null, 'PluginInterface', 'showLoading', []);
      },
      // 隐藏阻塞加载Loading
      hideLoading: function () {
          exec(null, null, 'PluginInterface', 'hideLoading', []);
      },
      // 获取海拔
      getSeaHeight: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getSeaHeight', [mac]);
      },
      // 连接到BLE设备
      connectBleDevice: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'connectBleDevice', [mac]);
      },
      // 空调伴侣-查询电量
      getDeviceHid: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getDeviceHid', [mac]);
      },
      // 空调伴侣-清除电量
      getGridConList: function (mac, type, callback) {
          exec(callback, null, 'PluginInterface', 'getGridConList', [mac, type]);
      },
      // 空调伴侣-清除电量
      clearHistoricalPhotovoltaicPowerData: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'clearHistoricalPhotovoltaicPowerData', [mac]);
      },
      // 空调伴侣-红外学习-删除
      delDefineOfLearningResult: function (mac, defineIds, callback) {
          exec(callback, null, 'PluginInterface', 'delDefineOfLearningResult', [mac, defineIds]);
      },
      // 空调伴侣-红外学习-添加
      addDefineOfLearningResult: function (mac, opt, p, callback) {
          exec(callback, null, 'PluginInterface', 'addDefineOfLearningResult', [mac, opt, p]);
      },
      // 空调伴侣-红外学习-查询
      getDefineOfLearningResultList: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getDefineOfLearningResultList', [mac]);
      },
      // 传感器查询状态接口
      getOuriboDevicesAllStatus: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getOuriboDevicesAllStatus', [mac]);
      },
      // 消息列表
      getMsgRequest: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getMsgRequest', [mac]);
      },
      // 打开插件
      startPlugin: function (mac) {
          exec(null, null, 'PluginInterface', 'startPlugin', [mac]);
      },
      // 通过 mac 获取设备信息
      getGatewayDevList: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getGatewayDevList', [mac]);
      },
      // 添加蓝牙子设备列表
      addBleSubDevice: function () {
          exec(null, null, 'PluginInterface', 'addBleSubDevice', []);
      },
      // 跳转语音技能界面
      startVoiceMainActivity: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'startVoiceMainActivity', [mac]);
      },
      // 欧瑞博灯带设置接口
      setLightBeltControl: function (mac, payload, callback) {
          exec(callback, null, 'PluginInterface', 'setLightBeltControl', [mac, payload]);
      },
      // 获取设备的实时故障消息
      getDevRealTimeFault: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getDevRealTimeFault', [mac]);
      },
      // 空调伴侣-获取光伏空调当日用电\发电量
      getDayUseAndGenerElec: function (mac, oneday, callback) {
          exec(callback, null, 'PluginInterface', 'getDayUseAndGenerElec', [mac, oneday]);
      },
      // 空调伴侣-获取光伏空调发电统计数据
      getElecGenerList: function (mac, type, oneday, callback) {
          exec(callback, null, 'PluginInterface', 'getElecGenerList', [mac, type, oneday]);
      },
      // 空调伴侣-查询电量,新增oneday字段
      getGridConListOneDay: function (mac, type, oneday, callback) {
          exec(callback, null, 'PluginInterface', 'getGridConListOneDay', [mac, type, oneday]);
      },
      // 蒸烤双能机___获取云菜谱列表
      getCloudMenuList: function (mid, index, cnt, callback) {
          exec(callback, null, 'PluginInterface', 'getCloudMenuList', [mid, index, cnt]);
      },
      // 蒸烤双能机___获取云菜单详细步骤
      getCloudMenuDetailSteps: function (cid, callback) {
          exec(callback, null, 'PluginInterface', 'getCloudMenuDetailSteps', [cid]);
      },
      // 蒸烤双能机___搜索云菜单
      searchCloudMenu: function (keyword, mid, index, cnt, callback) {
          exec(callback, null, 'PluginInterface', 'searchCloudMenu', [keyword, mid, index, cnt]);
      },
      // 写入用户自有数据
      setUserData: function (key, value, callback) {
          exec(callback, null, 'PluginInterface', 'setUserData', [key, value]);
      },
      // 读取用户自有数据
      getUserData: function (key, callback) {
          exec(callback, null, 'PluginInterface', 'getUserData', [key]);
      },
      // 获取一日三餐推荐菜谱
      getRecommendedMenu: function (callback) {
          exec(callback, null, 'PluginInterface', 'getRecommendedMenu', []);
      },
      // 添加菜谱到菜篮子
      addDishToBasket: function (addDatas, callback) {
          exec(callback, null, 'PluginInterface', 'addDishToBasket', [addDatas]);
      },
      // 从菜篮子里移除菜谱
      removeDishFromBasket: function (idsArr, callback) {
          exec(callback, null, 'PluginInterface', 'removeDishFromBasket', [idsArr]);
      },
      // 获取菜篮子列表
      getDishFromBasket: function (callback) {
          exec(callback, null, 'PluginInterface', 'getDishFromBasket', []);
      },
      // 菜篮子分享
      shareDishBasket: function (basketArr, callback) {
          exec(callback, null, 'PluginInterface', 'shareDishBasket', [basketArr]);
      },
      // 菜谱：长按监听振动
      longClickListenerVibrator: function () {
          exec(null, null, 'PluginInterface', 'longClickListenerVibrator', []);
      },
      // 菜谱：生成清单
      generateMenuListByCaptureImg: function (callback) {
          exec(callback, null, 'PluginInterface', 'generateMenuListByCaptureImg', []);
      },
      // 分享菜篮子URL
      shareDishBasketUrl: function (shareUrl) {
          exec(null, null, 'PluginInterface', 'shareDishBasketUrl', [shareUrl]);
      },
      // 智慧睡眠-获取首页数据
      getMainPageData: function (json, callback) {
          exec(callback, null, 'PluginInterface', 'getMainPageData', [json]);
      },
      // 智慧睡眠-跳转到睡眠界面并且打开音乐
      startSleepMusic: function (index, callback) {
          exec(callback, null, 'PluginInterface', 'startSleepMusic', [index]);
      },
      // 通过mac获取设备对应房间下的所有设备数量
      getRoomDeviceSize: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getRoomDeviceSize', [mac]);
      },
      // 控制入睡提醒、懒人起床、智能模式开关
      requestStartLinkTask: function (iid, opt, callback) {
          exec(callback, null, 'PluginInterface', 'requestStartLinkTask', [iid, opt]);
      },
      // 获取家庭列表
      getCurrentHomeSceneList: function (callback) {
          exec(callback, null, 'PluginInterface', 'getCurrentHomeSceneList', []);
      },
      // 播放暂停音乐
      playOrPauseMusic: function (opt, callback) {
          exec(callback, null, 'PluginInterface', 'playOrPauseMusic', [opt]);
      },
      // 获取播放信息
      getPlayStatus: function (callback) {
          exec(callback, null, 'PluginInterface', 'getPlayStatus', []);
      },
      // 创建联动
      editOrCreateLinkScene: function (json, string, callback) {
          exec(callback, null, 'PluginInterface', 'editOrCreateLinkScene', [json, string]);
      },
      // 打开/关闭 智慧睡眠-智能调节
      setIntelligenceSwitch: function (opt, callback) {
          exec(callback, null, 'PluginInterface', 'setIntelligenceSwitch', [opt]);
      },
      // 打开/关闭 智慧睡眠-智能调节
      getLinkItemData: function (iid, callback) {
          exec(callback, null, 'PluginInterface', 'getLinkItemData', [iid]);
      },
      // 跳转场景编辑页面
      goToEditScene: function (index, callback) {
          exec(callback, null, 'PluginInterface', 'goToEditScene', [index]);
      },
      // 有规律（取小时，天平均值）查询设备历史记录 (温湿度传感器)
      getDeviceRegulationLogs: function (devId, startTime, endTime, code, callback) {
          exec(callback, null, 'PluginInterface', 'getDeviceRegulationLogs', [devId, startTime, endTime, code]);
      },
      // 获取当前家庭列表
      getCurrentHomeList: function (callback) {
          exec(callback, null, 'PluginInterface', 'getCurrentHomeList', []);
      },
      // 获取当前账号创建的家庭里对应的场景列表
      getDesignatedHomeSceneList: function (homeId, callback) {
          exec(callback, null, 'PluginInterface', 'getDesignatedHomeSceneList', [homeId]);
      },
      // 播放试听音乐
      tryPlaySleepMusic: function (index, status, callback) {
          exec(callback, null, 'PluginInterface', 'tryPlaySleepMusic', [index, status]);
      },
      // 创建/编辑 联动
      creteOrEditLink: function (json, callback) {
          exec(callback, null, 'PluginInterface', 'creteOrEditLink', [json]);
      },
      // 打开睡眠的入睡提醒/懒人起床 请求保存的联动数据
      getDevCustomData: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getDevCustomData', [mac]);
      },
      // 慕思：查询T10实时数据
      getDerucciGetBedStatus: function (mac, payload, callback) {
          exec(callback, null, 'PluginInterface', 'getDerucciGetBedStatus', [mac, payload]);
      },
      // 慕思：获取睡眠报告
      getDerucciGetSleepData: function (mac, payload, callback) {
          exec(callback, null, 'PluginInterface', 'getDerucciGetSleepData', [mac, payload]);
      },
      // 慕思：获取日期列表
      getDerucciGetDateList: function (mac, payload, callback) {
          exec(callback, null, 'PluginInterface', 'getDerucciGetDateList', [mac, payload]);
      },
      // 慕思：控制T10软硬度接口
      getDerucciSetPressure: function (mac, payload, callback) {
          exec(callback, null, 'PluginInterface', 'getDerucciSetPressure', [mac, payload]);
      },
      // 慕思：T10智能模式配置接口
      getDerucciSmartConfig: function (mac, payload, callback) {
          exec(callback, null, 'PluginInterface', 'getDerucciSmartConfig', [mac, payload]);
      },
      // 慕思：周、月睡眠报告
      getDerucciWeekList: function (mac, payload, callback) {
          exec(callback, null, 'PluginInterface', 'getDerucciWeekList', [mac, payload]);
      },
      // 慕思：双侧睡眠评分
      getDerucciGetSleepAllData: function (mac, data, callback) {
          exec(callback, null, 'PluginInterface', 'getDerucciGetSleepAllData', [mac, data]);
      },
      // 床垫配网界面
      goToConfigNetWorkForMattress: function (callback) {
          exec(callback, null, 'PluginInterface', 'goToConfigNetWorkForMattress', []);
      },
      // 查询窗帘开合度
      getCurtainOpenPercent: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getCurtainOpenPercent', [mac]);
      },

      /* ======== 总部展厅 五大系统 start ======== */

      // 总部展厅 获取五大系统所有设备状态信息
      getFiveSystemDevicesAllStatus: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getFiveSystemDevicesAllStatus', [mac]);
      },
      // 总部展厅 五大系统 画时代控制 上/下/左/右/ok/菜单/删除/返回
      screenControl: function (mac, json, callback) {
          exec(callback, null, 'PluginInterface', 'screenControl', [mac, json]);
      },

      /* ======== 总部展厅 五大系统 end ======== */

      /* ======== 海外版 涂鸦 start ======== */

      // 设置设备自定义数据接口
      SetDevCustomData: function (mac, subMac, type, value, callback) {
          exec(callback, null, 'PluginInterface', 'SetDevCustomData', [mac, subMac, type, value]);
      },
      // 获取设备自定义数据接口
      GetDevCustomData: function (mac, subMac, type, callback) {
          exec(callback, null, 'PluginInterface', 'GetDevCustomData', [mac, subMac, type]);
      },
      // 涂鸦体脂称新增用户接口
      tuyaWeightAdd: function (mac, WeightData, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaWeightAdd', [mac, WeightData]);
      },
      // 涂鸦体脂秤用户查询接口
      tuyaWeightQuery: function (mac, userId, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaWeightQuery', [mac, userId]);
      },
      // 涂鸦体脂秤用户删除
      tuyaWeightDelete: function (mac, userId, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaWeightDelete', [mac, userId]);
      },
      // 涂鸦体脂秤用户更新接口
      tuyaWeightUpdate: function (mac, updateData, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaWeightUpdate', [mac, updateData]);
      },
      // 涂鸦体脂称获取历史记录
      tuyaWeightHistory: function (mac, requestData, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaWeightHistory', [mac, requestData]);
      },
      // 涂鸦体脂称体重趋势获取
      tuyaWeightTrend: function (mac, userId, startDay, endDay, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaWeightTrend', [mac, userId, startDay, endDay]);
      },
      // 涂鸦体脂称认领单个称重记录
      tuyaWeightCheckData: function (mac, userId, id, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaWeightCheckData', [mac, userId, id]);
      },
      // 涂鸦体脂秤删除单个称重记录
      tuyaWeightHistorySingleDelete: function (mac, id, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaWeightHistorySingleDelete', [mac, id]);
      },
      // 涂鸦体脂称查询用户列表
      tuyaWeightList: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaWeightList', [mac]);
      },
      // 涂鸦体脂秤计算报告接口
      tuyaWeightDatas: function (mac, requestData, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaWeightDatas', [mac, requestData]);
      },
      // 保存 or 获取标识
      SaveOrGetData: function (key, value, isSave, callback) {
          exec(callback, null, 'PluginInterface', 'SaveOrGetData', [key, value, isSave]);
      },

      /* ======== 海外版 涂鸦 end ======== */

      /* ======== 国内版 涂鸦 start ======== */

      // 涂鸦请求设备详细信息接口
      tuyaRequestDevData: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaRequestDevData', [mac]);
      },
      // 涂鸦请求设备历史记录接口
      tuyaGetDevLogs: function (mac, startTime, endTime, logType, logSize, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaGetDevLogs', [mac, startTime, endTime, logType, logSize]);
      },
      // 涂鸦控制设备接口
      tuyaControlDev: function (mac, deviceTypeName, payload, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaControlDev', [mac, deviceTypeName, payload]);
      },
      // 涂鸦设备更多页面
      tuyaDeviceMore: function (mac) {
          exec(null, null, 'PluginInterface', 'tuyaDeviceMore', [mac]);
      },
      // 涂鸦获取网关下子设备
      tuyaGetSubDevListByGateWay: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaGetSubDevListByGateWay', [mac]);
      },
      // 涂鸦网关配置子设备选择界面
      tuyaZigbeeDevSelectPage: function () {
          exec(null, null, 'PluginInterface', 'tuyaZigbeeDevSelectPage', []);
      },
      // 涂鸦获取设备历史消息（温湿度传感器）
      tuyaGetDeviceLogs: function (mac, logStartTime, logEndTime, callback) {
          exec(callback, null, 'PluginInterface', 'tuyaGetDeviceLogs', [mac, logStartTime, logEndTime]);
      },

      /* ======== 国内版 涂鸦 end ======== */

      /* ======== 格力+4.0 抽奖 start ======== */

      // 用于获取用户抽奖券数量
      activityGetUserTickets: function (callback) {
          exec(callback, null, 'PluginInterface', 'activityGetUserTickets', []);
      },
      // 获取用户获奖纪录
      activityGetWinHistory: function (callback) {
          exec(callback, null, 'PluginInterface', 'activityGetWinHistory', []);
      },
      // 获取所有人的获奖纪录
      activityGetAllWinHistory: function (callback) {
          exec(callback, null, 'PluginInterface', 'activityGetAllWinHistory', []);
      },
      // 提交抽奖请求
      activityTakeLottery: function (callback) {
          exec(callback, null, 'PluginInterface', 'activityTakeLottery', []);
      },
      // 加载抽奖信息
      activityGetAwardMapping: function (callback) {
          exec(callback, null, 'PluginInterface', 'activityGetAwardMapping', []);
      },
      // 去添加设备
      startCatalogConfigActivity: function () {
          exec(null, null, 'PluginInterface', 'startCatalogConfigActivity', []);
      },
      // 跳转到商城账户页
      toMallUserPage: function () {
          exec(null, null, 'PluginInterface', 'toMallUserPage', []);
      },
      // 返回下载音乐进度, 更新插件UI
      downloadMusic: function (id, callback) {
          exec(callback, null, 'PluginInterface', 'downloadMusic', [id]);
      },
      // 获取云定时列表
      getCloudTimerByMac: function (mac, callback) {
          exec(callback, null, 'PluginInterface', 'getCloudTimerByMac', [mac]);
      },
      /* ======== 格力+4.0 抽奖 end ======== */

      /* ======== linkpad start ======== */
      // 留言
      startLinkPadMessageActivity: function (mac) {
          exec(null, null, 'PluginInterface', 'startLinkPadMessageActivity', [mac]);
      },
      // 场景
      startLinkPadSceneActivity: function (mac) {
          exec(null, null, 'PluginInterface', 'startLinkPadSceneActivity', [mac]);
      },
      /* ======== linkpad end ======== */

      /* ======== 研究性项目 start ======== */

      // 视觉冰箱获取摄像头及层数
      getRequestRefrigerator: function (mac, floor, callback) {
          exec(callback, null, 'PluginInterface', 'getRequestRefrigerator', [mac]);
      },
      // 视觉冰箱接口获取食物信息
      getFood: function (mac, floor, callback) {
          exec(callback, null, 'PluginInterface', 'getFood', [mac]);
      }

      /* ======== 研究性项目 end ======== */
  };
});
