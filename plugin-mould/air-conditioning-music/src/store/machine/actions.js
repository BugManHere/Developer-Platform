import Vue from 'vue';
import { defineTypes, types } from '../types';

const { customizeFunction, customizeInit } = require('../userdef');

export default {
  /**
   * @param {Object} context Vuex的context对象
   */
  [defineTypes.MACHINE_INIT](context) {
    // 获取配置
    const baseData = getConfig();
    // 更新配置到vuex
    updateConfig(context, baseData);
    // 创建状态机
    Vue.prototype.$stateMachine = new stateMachine(context);
    // 执行自定义函数初始化
    runCustomizeInit(context);
  },

  /**
   * @description 状态机执行事件
   * @param {Object} context Vuex的context对象
   * @param {Array} stateQueue 事件队列
   */
  [defineTypes.RUN_EVENT](context, stateQueue) {
    // 队列没有事件，退出
    if (!stateQueue.length) return;
    const { getters, dispatch } = context;
    // 从队列中获取事件stateEvent，解构得出identifier、statusName（指定到此status）
    const { identifier, statusName } = stateQueue.shift();
    // 根据identifier得出当前statusName：currentStatusName
    const currentStatusName = getters.statusMap[identifier].statusName;
    // 根据情况获取当前status信息，情况1：已有指定statusName，从statusInfoMap获取信息；情况2：没有指定statusName，从status指向中获取信息
    const nextStatusInfo = statusName ? getters.statusInfoMap[identifier][statusName] : getters.nextStatusInfoMap[identifier];
    // 获取指向statusName
    const nextStatusName = nextStatusInfo.statusName;
    // 如果statusName为undefined，不输出状态值
    if (nextStatusName && nextStatusName !== 'undefined') {
      // 获取自定义函数接入方式
      const customize = nextStatusInfo.customize;
      // 获取需要发送的指令
      const setData = nextStatusInfo.setData;
      // 定义自定义函数执行函数
      const runCustomizeFunction = identifier => {
        // 先判断是否存在，如果存在，传入context与参数currentStatusName与nextStatusName执行
        const fn = customizeFunction[identifier];
        if (fn) {
          fn(context, currentStatusName, nextStatusName);
        } else {
          console.info('找不到自定义函数', { identifier });
        }
      };
      // 如果自定义函数接入方式为'before'，在返回输出前执行动作
      customize === 'before' && runCustomizeFunction(identifier);
      // 如果自定义函数接入方式为'replace'，则取代输出
      if (customize === 'replace') {
        runCustomizeFunction(identifier);
      } else {
        // 将状态发送值输出
        dispatch(
          types.STATE_MACHINE_INTERFACE,
          { data: setData, type: 'output', identifier, from: currentStatusName, to: nextStatusName },
          { root: true }
        ).then(() => {
          // 如果自定义函数接入方式为'after'，在执行完输出函数后执行自定义函数
          customize === 'after' && runCustomizeFunction(identifier);
        });
      }
      // 根据identifier检查对应model的互斥
      checkLogic(context, identifier, nextStatusName);
    }
    // 执行下一事件
    dispatch(types.RUN_EVENT, stateQueue, { root: true });
  }
};

class stateMachine {
  /**
   *Creates an instance of stateMachine.
   * @param {Object} context Vuex的context对象
   * @memberof stateMachine 状态机模式
   */
  constructor(context) {
    // 记录content
    this.vuexContext = context;
    // 调用初始化
    this.initRun();
  }
  // 初始化
  initRun() {
    // 创建事件队列
    creatQueue.call(this, this.vuexContext);
    // 初始化状态机数据
    initData(this.vuexContext);
    // 实时刷新状态
    let checkTime = 0;
    let oldList = '';
    Object.defineProperty(this, 'updateState', {
      get() {
        const { getters, state, commit } = this.vuexContext;
        const result = JSON.stringify(
          getters.identifierArr.map(identifier => {
            return getters.statusMap[identifier].stateName;
          })
        );
        if (result === oldList || checkTime >= 20) {
          checkTime = 0;
        } else {
          checkTime += 1;
          oldList = result;
          this.updateState;
          commit(types.SET_BASEDATA, { funcDefine: state.baseData.funcDefine }, { root: true });
        }
        return true;
      },
      set(newVal) {
        return newVal;
      },
      Configurable: false
    });
    this.updateState;
  }
  // 根据identifier获取statusName
  getStatusName(identifier) {
    return this.vuexContext.getters.statusMap[identifier].statusName;
  }
  // 根据`identifier`激活`model`的次态
  nextStatus(identifier) {
    // 将事件推送到事件队列内
    this.stateQueue.push({ identifier, statusName: undefined });
    setTimeout(() => {
      this.updateState;
    }, 0);
  }
  // 根据identifier跳转到指定状态
  toStatus(identifier, statusName) {
    // 将事件推送到事件队列内
    this.stateQueue.push({ identifier, statusName: String(statusName) });
    setTimeout(() => {
      this.updateState;
    }, 0);
  }
  // 将checkLogic方法暴露，根据identifier检查model的互斥
  checkLogic(identifier) {
    checkLogic(this.vuexContext, identifier);
  }
}

// 执行自定义初始化方法
function runCustomizeInit(context) {
  const { getters } = context;
  getters.identifierArr.forEach(identifier => {
    // 先判断是否存在，如果存在，传入content执行
    customizeInit[identifier] && customizeInit[identifier](context);
  });
}

/**
 * @description 获取配置
 * @returns json配置
 */
function getConfig() {
  // 配置key
  const { key } = require('@/../plugin.id.json');
  // localconfig模式下强制启用本地配置
  const getLocalConfig = () => {
    const isLocalConfig = process.env.VUE_APP_MODE === 'local';
    return isLocalConfig && require(`@/../../../output/${key}.json`);
  };
  // 如果是development环境，获取线上配置
  const getServeConfig = () => {
    const isServeConfig = process.env.NODE_ENV === 'development';
    return isServeConfig ? window.storage.get('config') : require(`@/../../../output/${key}.json`);
  };
  // 本地模式下优先获取本地配置
  return getLocalConfig() || getServeConfig();
}

/**
 * @description 将配置更新到vuex
 * @param {Object} { commit, dispatch } Vuex的context对象
 * @param {Object} baseData 从json获取的配置
 */
function updateConfig({ commit, dispatch }, baseData) {
  if (!baseData) return;
  // 转换指令
  str2NumMap(baseData.funcDefine);
  // 更新到vuex
  commit(types.SET_BASEDATA, baseData, { root: true });
  commit(
    types.MACHINE_SET_STATE,
    {
      devOptions: {
        pluginVer: baseData.moreOption.pluginVer,
        mid: baseData.productModel,
        statueJson: JSON.stringify(baseData.moreOption.statueJson),
        statueJson2: JSON.stringify(baseData.moreOption.statueJson2)
      }
    },
    { root: true }
  );
  // 提交设备名变更
  dispatch(types.UPDATE_DEVICENAME, { data: { deviceName: baseData.deviceName }, type: 'deviceName' }, { root: true });
}

// 转换指令中的字符串（不重要，可以不看）
function str2NumMap(funcDefine) {
  // String转为Number
  funcDefine.forEach((model, index) => {
    const statusDefine = {};
    Object.keys(model.statusDefine).forEach(statusName => {
      statusDefine[statusName] = model.statusDefine[statusName];
      statusDefine[statusName].value = Number(statusDefine[statusName].value);
      if (model.statusDefine[statusName].moreCommand) {
        Object.keys(model.statusDefine[statusName].moreCommand).forEach(json => {
          statusDefine[statusName].moreCommand[json] = Number(statusDefine[statusName].moreCommand[json]);
        });
      }
    });
    funcDefine[index].statusDefine = statusDefine;
  });
}

/**
 * @description 根据identifier检查对应model的互斥
 * @param {Object} context Vuex的context对象
 * @param {String} identifier model的唯一标识符
 * @param {String} statusName 状态名称
 */
function checkLogic(context, identifier, statusName) {
  const { state, getters } = context;
  const checkStatusName = statusName || getters.statusMap[identifier].statusName;
  const checkStateName = `${identifier}_${checkStatusName}`;
  // 提取互斥逻辑
  const excludeStateNameArr = state.baseData.excludeMap[checkStateName];
  // 如果该状态存在互斥
  if (!excludeStateNameArr || !excludeStateNameArr.length) return;
  // 轮询互斥关系
  excludeStateNameArr.forEach(stateName => {
    // 找到互斥的identifier
    const identifier = getters.stateNameToId[stateName];
    if (!identifier) return;
    // 获取identifier的当前statusName
    const currentStatusName = getters.fakeStatusMap[identifier].statusName;
    // 获取identifier的当前stateName
    const currentStateName = `${identifier}_${currentStatusName}`;
    // 如果当前stateName被排斥，则跳转到指向状态
    stateName === currentStateName && Vue.prototype.$stateMachine.nextStatus(identifier);
  });
}

// 创建事件队列，绑定到作用域下
function creatQueue({ dispatch }) {
  // 创建队列数组
  let queue = [];
  Object.defineProperty(this, 'stateQueue', {
    // 改写getter方法
    get() {
      // setTimeout把方法放到下一个宏任务，保证队列更新
      setTimeout(() => {
        // 如果队列中存在事件，则执行
        queue.length && dispatch(types.RUN_EVENT, queue, { root: true });
      }, 0);
      return queue;
    },
    // 改写setter方法
    set(newVal) {
      queue = newVal;
    },
    // 不可删除
    Configurable: false
  });
  // 将事件队列暴露给状态机
  this.stateQueue = queue;
}

// 初始化数据
function initData({ state, dispatch, rootGetters }) {
  // 输出data
  const data = {};
  // 输入的数据
  const inputMap = rootGetters.inputMap;
  // 如果model在输入的数据中没有对应的json，则设置
  state.baseData.funcDefine.forEach(model => {
    // 获取model的json
    const json = model.json;
    // 如果json不在输入的数据里, 记录下来
    if (!(json in { ...inputMap, ...data })) {
      // 获取默认status的value
      const value = model.statusDefine.default.value;
      // 设置进对应的json里面
      data[json] = value;
    }
  });
  // 输出初始化数据
  dispatch(types.STATE_MACHINE_INITDATA, { data, type: 'init' }, { root: true });
}
