/** 业务逻辑代码 */
export default {
  // 用于状态机的map
  inputMap: state => {
    return state.control.dataObject;
  },
  // 模式的定义
  modDefine: (state, getters) => {
    const funcDefine_inertia = getters['machine/funcDefine_inertia'];
    return funcDefine_inertia.find(model => model.type === `inertia-${state.modKey}`);
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
  // 风速的定义
  fanDefine: (state, getters) => {
    return getters['machine/funcDefine_inertia'].find(model => model.type === `inertia-${state.fanKey}`);
  },
  // 风速的id
  fanIdentifier: (state, getters) => {
    return getters.fanDefine && getters.fanDefine.identifier;
  },
  fanCurrentStatusName: (state, getters) => {
    const statusMap = getters['machine/statusMap'];
    const fanIdentifier = getters.fanIdentifier;
    return statusMap[fanIdentifier].statusName;
  },
  // 风速调节是否可用
  fanAbleSet: (state, getters) => {
    const hideStateNameArr = getters['machine/hideStateNameArr'];
    return hideStateNameArr.every(state => !state.includes('FanPopup'));
  },
  // 高级功能按钮的定义
  buttonDefine: (state, getters) => {
    return getters['machine/funcDefine_active'].filter(model => model.type === 'active-button');
  },
  // 主页按钮的定义
  popupDefine: (state, getters) => {
    return getters['machine/funcDefine_active'].filter(model => model.type === `active-${state.popupsKey}`);
  },
  // 显示插槽1, 隐藏的状态被禁用就显示
  imshowSlot1: (state, getters) => {
    const models = getters['machine/funcDefine_inertia']
      .filter(model => model.type === 'inertia-imshowSlot1')
      .filter(model => getters['machine/hideStateNameArr'].some(stateName => stateName.includes(`${model.identifier}_`)));
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
    const models = getters['machine/funcDefine_inertia']
      .filter(model => model.type === 'inertia-imshowSlot2')
      .filter(model => getters['machine/hideStateNameArr'].some(stateName => stateName.includes(`${model.identifier}_`)));
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
    const models = getters['machine/funcDefine_inertia']
      .filter(model => model.type === `inertia-${state.temKey}`)
      .filter(model => !getters['machine/hideStateNameArr'].some(stateName => stateName.includes(`${model.identifier}_`)));
    // 如果存在检测字段，则使用（存在多个的情况时，只取第一个，其他不处理）
    return models.length && models[0].json; // 默认字段
  },
  // 温度显示值
  temSetVal: (state, getters) => {
    return getters.temSetJson && getters.inputMap[getters.temSetJson];
  },
  // 温度最小值设定
  temMinVal: (state, getters) => {
    const models = getters['machine/funcDefine_inertia']
      .filter(model => model.type === `inertia-${state.temMinKey}`)
      .filter(model => !getters['machine/hideStateNameArr'].some(stateName => stateName.includes(`${model.identifier}_`)));
    // 如果存在检测字段，则使用（存在多个的情况时，只取第一个，其他不处理）
    if (models.length) return getters.inputMap[models[0].json];
    return 16; // 默认温度最小值
  },
  // 温度最大值设定
  temMaxVal: (state, getters) => {
    const modules = getters['machine/funcDefine_inertia']
      .filter(model => model.type === `inertia-${state.temMaxKey}`)
      .filter(model => !getters['machine/hideStateNameArr'].some(stateName => stateName.includes(`${model.identifier}_`)));
    if (modules.length) return getters.inputMap[modules[0].json];
    return 30; // 默认温度最大值
  },
  // 温度间隔
  temStep: state => {
    return state.machine.baseData.moreOption.temStep;
  }
};
