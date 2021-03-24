const { errorCode, codeParse } = require('@/mixins/error');

/** 业务逻辑代码 */
export default {
  // 用于状态机的map
  inputMap: state => {
    return state.control.dataObject;
  },
  // 开关机的statusName
  powStatusName: (state, getters) => {
    const statusMap = getters['machine/statusMap'];
    return statusMap.Pow && statusMap.Pow.statusName;
  },
  // 开关机的定义
  powType: (state, getters) => {
    return getters.powStatusName === 'status_1';
  },
  // 模式的定义
  modDefine: (state, getters) => {
    const models = getModelsByType({ getters }, 'inertia', state.modKey);
    return models.length && models[0];
  },
  // 模式的id
  modIdentifier: (state, getters) => {
    return getters.modDefine && getters.modDefine.identifier;
  },
  // 模式的当前statusName
  modCurrentStatusName: (state, getters) => {
    const statusMap = getters['machine/statusMap'];
    const modIdentifier = getters.modIdentifier;
    return statusMap[modIdentifier].statusName;
  },
  // 特殊模式的定义
  spModDefine: (state, getters) => {
    return getModelsByType({ getters }, 'inertia', state.spModKey);
  },
  modModels: (state, getters) => {
    return [getters.modDefine, ...getters.spModDefine];
  },
  modSwitchType: (state, getters) => {
    let result = 'off';
    getters.modModels.some(model => {
      const { identifier } = model;
      const statusName = getCurrentStatusName({ getters }, identifier);
      if (statusName === 'undefined') return false;
      result = model.statusDefine[statusName].icon.type;
      return true;
    });
    return result;
  },
  modTextKey: (state, getters) => {
    let result = '';
    getters.modModels.some(model => {
      const { identifier } = model;
      const statusName = getCurrentStatusName({ getters }, identifier);
      if (statusName === 'undefined') return false;
      result = `mod.${identifier}_${model.statusDefine[statusName].name}`;
      return true;
    });
    return result;
  },
  // 风速的定义
  fanDefine: (state, getters) => {
    const models = getAllModelsByType({ getters }, 'inertia', state.fanKey);
    return models.length && models[0];
  },
  // 风速的id
  fanIdentifier: (state, getters) => {
    return getters.fanDefine && getters.fanDefine.identifier;
  },
  // 风速当前statusName
  fanCurrentStatusName: (state, getters) => {
    const statusMap = getters['machine/statusMap'];
    const fanIdentifier = getters.fanIdentifier;
    return statusMap[fanIdentifier].statusName;
  },
  // 风速调节是否可用
  fanAbleSet: (state, getters) => {
    const hideStateNameArr = getters['machine/hideStateNameArr'];
    return hideStateNameArr.every(stateName => !stateName.includes('FanPopup'));
  },
  // 风速的状态指向循环
  fanLoop: (state, getters) => {
    const statusLoop = getters['machine/statusLoop'];
    return statusLoop[getters.fanIdentifier];
  },
  // 特殊风速的定义
  specialFanDefine: (state, getters) => {
    const models = getAllModelsByType({ getters }, 'inertia', state.specialFan);
    return models.length && models[0];
  },
  // 特殊风速的id
  specialFanIdentifier: (state, getters) => {
    return getters.specialFanDefine && getters.specialFanDefine.identifier;
  },
  // 特殊风速的状态指向循环
  specialFanLoop: (state, getters) => {
    const statusLoop = getters['machine/statusLoop'];
    return statusLoop[getters.specialFanIdentifier];
  },
  // 风速当前statusName
  specialFanCurrentStatusName: (state, getters) => {
    const statusMap = getters['machine/statusMap'];
    const fanIdentifier = getters.specialFanIdentifier;
    return statusMap[fanIdentifier] && statusMap[fanIdentifier].statusName;
  },
  swingDefine: (state, getters) => {
    return getAllModelsByType({ getters }, 'active', state.swingKey);
  },
  // 高级功能按钮的定义
  buttonDefine: (state, getters) => {
    return getAllModelsByType({ getters }, 'active', state.buttonKey);
  },
  // 高级功能按钮的定义
  cardFuncDefine: (state, getters) => {
    return getAllModelsByType({ getters }, 'active', state.cardFuncKey);
  },
  // 主页按钮的定义
  mainBtnDefine: (state, getters) => {
    return getAllModelsByType({ getters }, 'active', state.mainBtnKey);
  },
  mainPopupDefine: (state, getters) => {
    const models = getAllModelsByType({ getters }, 'inertia', state.mainPopupKey);
    return models.length && models[0];
  },
  mainPopupIdentifier: (state, getters) => {
    return getters.mainPopupDefine && getters.mainPopupDefine.identifier;
  },
  mainPopupCurrentStatusName: (state, getters) => {
    const statusMap = getters['machine/statusMap'];
    const identifier = getters.mainPopupIdentifier;
    return statusMap[identifier].statusName;
  },
  // 显示插槽1, 隐藏的状态被禁用就显示
  imshowSlot1: (state, getters) => {
    const models = getHideModelsByType({ getters }, 'inertia', state.imshowSlot1);
    // 存在多个的情况时，只取第一个，其他不处理
    if (models.length) {
      const json = models[0].json;
      const value = getters.inputMap[json];
      const identifier = models[0].identifier;
      // 处理字符串内运算
      const text = window.myvm.$language(`slot1.${identifier}`);
      let result = text;
      const textMatch = text.match(/{{(%s.*)}}/);
      if (textMatch) {
        const matchContent = textMatch[1].replace('%s', value);
        // 不推荐此写法，可优化
        result = text.replace(/{{(%s.*)}}/, eval(matchContent));
      } else {
        result = text.replace('%s', value);
      }
      return result;
    }
    return undefined;
  },
  // 显示插槽2, 隐藏的状态被禁用就显示
  imshowSlot2: (state, getters) => {
    const models = getHideModelsByType({ getters }, 'inertia', state.imshowSlot2);
    // 存在多个的情况时，只取第一个，其他不处理
    if (models.length) {
      const json = models[0].json;
      const value = getters.inputMap[json];
      const id = models[0].identifier;
      // 处理字符串内运算
      const text = window.myvm.$language(`slot2.${id}`);
      let result = text;
      const textMatch = text.match(/{{(%s.*)}}/);
      if (textMatch) {
        const matchContent = textMatch[1].replace('%s', value);
        // 不推荐此写法，可优化
        result = text.replace(/{{(%s.*)}}/, eval(matchContent));
      } else {
        result = text.replace('%s', value);
      }
      return result;
    }
    return undefined;
  },
  // 温度设定
  temSetJson: (state, getters) => {
    const models = getModelsByType({ getters }, 'inertia', state.temKey);
    return models.length && models[0].json;
  },
  // 温度显示值
  temSetVal: (state, getters) => {
    return getters.temSetJson && getTem({ getters, state });
  },
  // 温度最小值设定
  temMinVal: (state, getters) => {
    const models = getModelsByType({ getters }, 'inertia', state.temMinKey);
    if (models.length) return getters.inputMap[models[0].json];
    return 16; // 默认温度最小值
  },
  // 温度最大值设定
  temMaxVal: (state, getters) => {
    const models = getModelsByType({ getters }, 'inertia', state.temMaxKey);
    if (models.length) return getters.inputMap[models[0].json];
    return 30; // 默认温度最大值
  },
  // 温度间隔
  temStep: (state, getters) => {
    return getters.temSetJson === 'SetTem' ? Number(state.machine.baseData.moreOption.temStep) : 5;
  },
  // 温度调节是否可用
  temAbleSet: (state, getters) => {
    return getters.temSetJson && getters.temMinVal < getters.temMaxVal;
  },
  // 查询协议解析出对应故障信息
  errorMsgs: (state, getters) => {
    const list = [];
    const hasCodeMap = {};
    let controlAble = true;
    state.errorJsons.forEach(errorJson => {
      const base = getters.inputMap[errorJson];
      const errorList = parseErrorJson(base);
      errorList.forEach((hasError, errorIndex) => {
        if (hasError) {
          const code = codeParse[errorJson][errorIndex];
          const msg = errorCode[code];
          if (hasCodeMap[code] || !msg) return;
          controlAble = controlAble && msg.controlAble;
          msg.code = code;
          hasCodeMap[code] = true;
          list.push(msg);
        }
      });
    });
    return {
      list,
      controlAble
    };
  }
};

// 找到未被隐藏的功能
function getModelsByType({ getters }, mainType, secondType) {
  return getAllModelsByType({ getters }, mainType, secondType).filter(
    model => !getters['machine/hideStateNameArr'].some(stateName => checkReg(stateName, model.identifier))
  );
}

// 找到被隐藏的功能
function getHideModelsByType({ getters }, mainType, secondType) {
  return getAllModelsByType({ getters }, mainType, secondType).filter(model =>
    getters['machine/hideStateNameArr'].some(stateName => checkReg(stateName, model.identifier))
  );
}

// 找到所有功能，不管是否被隐藏
function getAllModelsByType({ getters }, mainType, secondType) {
  return getters[`machine/funcDefine_${mainType}`].filter(model => model.type === `${mainType}-${secondType}`);
}

// 检查type
function checkReg(str, checkStr) {
  const reg = new RegExp(`^${checkStr}_`);
  return reg.test(str);
}

// 获取温度
function getTem({ getters, state }) {
  const temInt = getters.inputMap[getters.temSetJson];
  let temDeci = 0;
  if (getters.temStep < 1) {
    const temJson05 = state.jsonArr.tem05;
    const temJson01 = state.jsonArr.tem01;
    const temDeci05 = (temJson05 && getters.inputMap[temJson05] * 5) || 0;
    const temDeci01 = (temJson01 && getters.inputMap[temJson01]) || 0;
    temDeci = temDeci01 || temDeci05;
  }
  return temInt + temDeci / 10;
}

// 解析故障字段
function parseErrorJson(value) {
  return value
    .toString(2)
    .split('')
    .reverse()
    .map(v => Number(v));
}

function getCurrentStatusName({ getters }, identifier) {
  const statusMap = getters['machine/statusMap'];
  return String(statusMap[identifier].statusName);
}
