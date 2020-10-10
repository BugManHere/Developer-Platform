const StateBase = require('@/stateMachine/base');
const StateMethod = require('@/stateMachine/method');
const StatePort = require('@/stateMachine/port');

/**
 * @description 筛选出显性功能
 * @return Array [module]
 */
export const funcDefine_active = () => {
  return StateBase.funcDefine.filter(module => module.type.includes('active'));
};
/**
 * @description 筛选出隐性功能
 * @return Array [module]
 */
export const funcDefine_inertia = () => {
  return StateBase.funcDefine.filter(module => module.type.includes('inertia'));
};
/**
 * @description module的identifier集合
 * @return Array [identifier]
 */
export const identifierArr = () => {
  return StateBase.funcDefine.map(module => module.identifier);
};
/**
 * @description funcDefine的对象版本
 * @return Object {identifier: module}
 */
export const funcDefineMap = () => {
  const result = {};
  StateBase.funcDefine.forEach(module => {
    const { identifier } = module;
    result[identifier] = module;
  });
  return result;
};
/**
 * @description hideMap的反向对象，根据被隐藏的state获取state
 * @return Object {state: [state]}
 */
export const hideMapReverse = () => {
  const result = {};
  Object.keys(StateBase.hideMap).forEach(state => {
    // 提取被隐藏的state
    StateBase.hideMap[state].forEach(hideState => {
      result[hideState] ? result[hideState].push(state) : (result[hideState] = [state]);
    });
  });
  return result;
};
/**
 * @description 根据identifier与value获取当前status
 * @return Object {identifier: {value: status}}
 */
export const valToStatusMap = () => {
  const result = {};
  StateBase.funcDefine.forEach(module => {
    const { identifier } = module;
    result[identifier] = StateMethod.getStatus(module, true);
  });
  return result;
};
/**
 * @description 根据identifier与value获取当前status（没经过隐藏关系处理）
 * @return Object {identifier: {value: status}}
 */
export const valToRealStatus = () => {
  const result = {};
  StateBase.funcDefine.forEach(module => {
    const { identifier } = module;
    result[identifier] = StateBase.getStatus(module, false);
  });
  return result;
};
/**
 * @description 根据identifier获取当前状态的更多信息
 * @return Object: {identifier: {status, state, define}}
 */
export const statusMap = that => {
  const result = {};
  StateBase.funcDefine.forEach(module => {
    const { identifier, json } = module;
    const currentVal = StatePort.inputMap[json];
    let status = that.valToStatusMap[identifier][currentVal];
    let define = module.statusDefine[status];
    if (!define) {
      status = 'default';
      define = module.statusDefine[status];
    }
    const state = `${identifier}_${status}`;
    const realStatus = that.valToRealStatus[identifier][currentVal];
    const realState = `${identifier}_${realStatus}`;
    const realDefine = module.statusDefine[realStatus];
    result[identifier] = {
      status,
      state,
      define,
      realStatus,
      realState,
      realDefine
    };
  });
  return result;
};
/**
 * @description status对应的identifier
 * @return Object: {state: identifier}
 */

export const stateToId = () => {
  const result = {};
  StateBase.funcDefine.forEach(module => {
    Object.keys(module.statusDefine).forEach(status => {
      const state = `${module.identifier}_${status}`;
      result[state] = module.identifier;
    });
  });
  return result;
};
/**
 * @description 功能的默认状态（被互斥后执行的状态）
 * @return Object: {identifier: {status, json, define}}
 */
export const defaultStatusMap = () => {
  const result = {};
  StateBase.funcDefine.forEach(module => {
    const { identifier, json } = module;
    const defaultStatus = module.statusDefine.default;
    const moreCommand = define.moreCommand;
    let setData = moreCommand || {};
    setData[json] = defaultStatus.value;
    result[identifier] = {
      setData,
      json,
      define: defaultStatus
    };
  });
  return result;
};
/**
 * @description 隐藏的state列表
 * @return Array: [state]
 */
export const hideStateArr = that => {
  const result = [];
  that.identifierArr.forEach(identifier => {
    const status = that.statusMap[identifier].status;
    const state = `${identifier}_${status}`;
    if (StateBase.hideMap[state]) {
      result.push(...StateBase.hideMap[state]);
    }
  });
  return result;
};
/**
 * @description status指向关系
 * @return Object: {identifier: [status]}
 */
export const statusLoop = () => {
  const result = {};
  // 设定规则，undefined不能被指向，会被重新指向为default
  const rule = status => {
    let result = status || 'default';
    result === 'undefined' && (result = 'default');
    return result;
  };
  // 遍历功能，提取status关系
  StateBase.funcDefine.forEach(module => {
    const { identifier, map } = module.identifier;
    let status = statusMap[identifier].status; // function的当前status
    const statusArr = []; // status顺序数组形式
    const checkStatusArr = []; // 已检查的状态
    if (map) {
      let directionStatus = rule(map[status]); // status指向
      // 再次指向原点时推出，形成闭环
      while (!checkStatusArr.includes(directionStatus)) {
        status = directionStatus; // 下一个status
        const state = `${identifier}_${status}`;
        hideStateArr.includes(state) || statusArr.push(directionStatus); // 按顺序存入数组
        checkStatusArr.push(directionStatus); // 按顺序存入数组
        directionStatus = rule(map[status]) || 'default'; // 更新status指向
      }
    } else {
      statusArr.push(status);
    }
    result[identifier] = statusArr;
  });
  return result;
};
/**
 * @description module的当前指向status
 * @return Object: {identifier: status}
 */
export const statusDirectionMap = () => {
  const result = {};
  // 遍历功能，提取function当前指向status
  identifierArr.forEach(identifier => {
    const directionStatus = statusLoop[identifier].find(status => {
      const state = `${identifier}_${status}`; // 获取指向state
      return !hideStateArr.includes(state); // 如果没被隐藏，则返回
    });
    result[identifier] = directionStatus || statusMap[identifier].status; // 如果都被隐藏， 则返回当前status
  });
  return result;
};
/**
 * @description 没有指向的module
 * @return Array: [identifier]
 */
export const noDirectionFuncArr = () => {
  const result = identifierArr.filter(identifier => {
    const currentStatus = statusMap[identifier].status; // function的当前status
    const directionStatus = statusDirectionMap[identifier]; // function的指向status
    return currentStatus === directionStatus;
  });
  return result;
};
/**
 * @description 输入被隐藏的function的identifier，返回参与隐藏的function的identifier
 * @return Object: {identifier: {state: state}}
 */
export const hideByStateMapr = () => {
  const result = {};
  noDirectionFuncArr.forEach(identifier => {
    const statusArr = statusLoop[identifier]; // 获取status指向数组
    result[identifier] = {};
    if (statusArr.length >= 1) {
      // 轮询每个states指向
      statusArr.forEach(status => {
        const state = `${identifier}_${status}`;
        const stateArr = hideMapReverse[state];
        stateArr && (result[identifier] = { ...result[identifier], [state]: stateArr });
      });
    }
  });
  return result;
};
/**
 * @description 当前状态的下一状态列表
 * @return Object: {identifier: {status, define, json, setData, customize}}
 */
export const nextStatusMap = () => {
  const result = {};
  StateBase.funcDefine.forEach(module => {
    const { identifier, json } = module.identifier;
    let status = statusDirectionMap[identifier]; // function的指向status
    let define = module.statusDefine[status];
    if (!define) {
      status = 'default';
      define = module.statusDefine[status];
    }
    const customize = define.customize;
    const moreCommand = define.moreCommand;
    let setData = moreCommand || {};
    setData[json] = define.value;
    result[id] = {
      status,
      json,
      define,
      setData,
      customize
    };
  });
  return result;
};
// 所有功能的JSON字段
export const jsonArr = () => {
  const arr = [];
  StateBase.funcDefine.forEach(module => {
    Object.keys(module.statusDefine).forEach(status => {
      status === 'undefined' || module.statusDefine[status].customize === 'replace' || arr.includes(module.json) || arr.push(module.json);
      if (module.statusDefine[status].moreCommand) {
        Object.keys(module.statusDefine[status].moreCommand).forEach(moreJson => {
          arr.includes(moreJson) || arr.push(moreJson);
        });
      }
    });
  });
  return arr;
};
