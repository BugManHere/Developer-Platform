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
  // 睡眠的statusName
  slpStatusName: (state, getters) => {
    const statusMap = getters['machine/statusMap'];
    return statusMap.Pow && statusMap.Pow.statusName;
  },
  // 睡眠的定义
  slpType: (state, getters) => {
    return getters.powStatusName === 'status_1';
  },
  // 模式的定义
  modDefine: (state, getters) => {
    const models = getAllModelsByType({ getters }, 'inertia', state.modKey);
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
  // 模式调节是否可用
  modAbleSet: (state, getters) => {
    const hideStateNameArr = getters['machine/hideStateNameArr'];
    const modStateNameArr = getters['machine/stateNameMap'][getters.modIdentifier];
    return modStateNameArr && modStateNameArr.some(stateName => !hideStateNameArr.includes(stateName));
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
  // 高级功能按钮的定义
  buttonDefine: (state, getters) => {
    return getAllModelsByType({ getters }, 'active', state.buttonKey);
  },
  // 主页按钮的定义
  popupDefine: (state, getters) => {
    return getAllModelsByType({ getters }, 'active', state.popupsKey);
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
  if (getters.temStep === 0.5) {
    const temJson05 = state.jsonArr.tem05;
    temDeci = (temJson05 && getters.inputMap[temJson05] * 5) || 0;
  } else if (getters.temStep === 0.1) {
    const temJson05 = state.jsonArr.tem05;
    const temJson01 = state.jsonArr.tem01;
    temDeci05 = (temJson05 && getters.inputMap[temJson05] * 5) || 0;
    temDeci01 = (temJson01 && getters.inputMap[temJson01]) || 0;
    temDeci = temDeci01 || temDeci05;
  }
  return temInt + temDeci / 10;
}
