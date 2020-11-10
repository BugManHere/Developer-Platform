import * as types from './types';
import Vue from 'vue';

const { customizeFunction, customizeInit } = require('./userdef');

export default {
  /**
   * @description 状态机初始化
   */
  [types.INIT](context) {
    const { commit } = context;
    // 获取配置
    const baseData = getConfig();
    // 更新配置到vuex
    updateConfig({ commit }, baseData);
    // 创建状态机
    Vue.prototype.$stateMachine = new stateMachine(context);
    // 执行自定义函数初始化
    runCustomizeInit(context);
  },

  /**
   * @description 状态机执行事件
   * @input stateQueue: 事件队列
   */
  [types.RUN_QUEUE](context, stateQueue) {
    const { getters, dispatch } = context;
    if (!stateQueue.length) return;
    // 从队列中获取事件stateEvent，解构得出identifier、statusName（指定到此status）
    const { identifier, statusName } = stateQueue.shift();
    // 根据identifier得出当前statusName：currentStatusName
    const currentStatusName = getters.statusMap[identifier].statusName;
    // 根据情况获取当前status信息，情况1：已有指定statusName，从statusInfoMap获取信息；情况2：没有指定statusName，从status指向中获取信息
    const nextStatusInfo = statusName ? getters.statusInfoMap[identifier][statusName] : getters.nextStatusInfoMap[identifier];
    // 下一状态名称
    const nextStatusName = nextStatusInfo.statusName;
    // 如果statusName为undefined，返回
    if (!nextStatusName || nextStatusName === 'undefined') return;
    // 获取自定义函数接入方式
    const customize = nextStatusInfo.customize;
    // 获取需要发送的指令
    const setData = nextStatusInfo.setData;
    // 定义自定义函数执行函数
    const runCustomizeFunction = identifier => {
      // 先判断是否存在，如果存在，传入content与参数currentStatusName与nextStatusName执行
      customizeFunction[identifier] && customizeFunction[identifier](context, currentStatusName, nextStatusInfo.statusName);
    };
    // 如果自定义函数接入方式为'before'，在返回输出前执行动作
    customize === 'before' && runCustomizeFunction(identifier);
    // 如果自定义函数接入方式为'replace'，则取代输出
    if (customize === 'replace') {
      runCustomizeFunction(identifier);
    } else {
      // 将状态发送值输出
      dispatch('STATE_MACHINE_INTERFACE', setData, { root: true }).then(() => {
        // 如果自定义函数接入方式为'after'，在执行完输出函数后执行自定义函数
        customize === 'after' && runCustomizeFunction(identifier);
      });
    }
    // 状态名称
    const stateName = `${identifier}_${nextStatusName}`;
    // 检查互斥
    checkLogic(context, stateName);
    // 如果队列里面还有事件，继续执行
    stateQueue.length && dispatch(types.RUN_QUEUE, stateQueue);
  }
};

// 定义状态机
class stateMachine {
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
  }
  // 根据identifier获取statusName
  getStatus(identifier) {
    return this.vuexContext.getters.statusMap[identifier].statusName;
  }
  // 根据identifier跳转到指向status
  nextStatus(identifier) {
    // 将事件推送到事件队列内
    this.stateQueue.push({ identifier, statusName: undefined });
    // 触发事件
  }
  // 根据identifier跳转到指定status
  toStatus(identifier, statusName) {
    // 将事件推送到事件队列内
    this.stateQueue.push({ identifier, statusName: String(statusName) });
    // 触发事件
    this.vuexContext.dispatch(types.RUN_QUEUE, this.stateQueue);
  }
}

// 执行自定义函数初始化
function runCustomizeInit(context) {
  const { getters } = context;
  getters.identifierArr.forEach(identifier => {
    // 先判断是否存在，如果存在，传入content执行
    customizeInit[identifier] && customizeInit[identifier](context);
  });
}

// 获取配置
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

// 将配置更新到vuex
function updateConfig({ commit }, baseData) {
  // 转换指令
  str2NumMap(baseData.funcDefine);
  // 更新到vuex
  commit(types.SET_BASEDATA, baseData);
  commit(types.SET_STATE, {
    devOptions: {
      pluginVer: baseData.moreOption.pluginVer,
      mid: baseData.productModel,
      statueJson: JSON.stringify(baseData.moreOption.statueJson),
      statueJson2: JSON.stringify(baseData.moreOption.statueJson2)
    }
  });
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
 * @description 执行互斥
 * @input context: Vuex的context对象
 * @input stateName: 状态名称
 */
function checkLogic(context, stateName) {
  const { state, getters } = context;
  // 提取互斥逻辑
  const excludeStateNameArr = state.baseData.excludeMap[stateName];
  // 如果该状态存在互斥
  if (!excludeStateNameArr || !excludeStateNameArr.length) return;
  // 轮询互斥关系
  excludeStateNameArr.forEach(stateName => {
    // 找到互斥的identifier
    const identifier = getters.stateNameToId[stateName];
    if (!identifier) return;
    // 获取identifier的当前statusName
    const currentStatusName = getters.statusMap[identifier].statusName;
    // 获取identifier的当前stateName
    const currentStateName = `${identifier}_${currentStatusName}`;
    // 如果当前stateName被排斥，则跳转到指向状态
    stateName === currentStateName && Vue.prototype.$stateMachine.nextStatus(identifier);
  });
}

// 创建事件队列，绑定到作用域下
function creatQueue({ dispatch }) {
  // 创建事件队列
  let queue = [];
  // 事件队列清空
  Object.defineProperty(this, 'stateQueue', {
    // 改写getter方法
    get() {
      // setTimeout把方法放到下一个宏任务，保证数组更新
      setTimeout(() => {
        // 如果队列中存在事件，则执行
        queue.length && dispatch(types.RUN_QUEUE, queue);
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
  dispatch('STATE_MACHINE_INITDATA', data, { root: true });
}
