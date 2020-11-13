/** stateMachine */
export default {
  /**
   * @description 显性功能
   * @return Array [model]
   */
  funcDefine_active: state => {
    return state.baseData.funcDefine.filter(model => model.type.includes('active'));
  },
  /**
   * @description 隐性功能
   * @return Array [model]
   */
  funcDefine_inertia: state => {
    return state.baseData.funcDefine.filter(model => model.type.includes('inertia'));
  },
  /**
   * @description identifier合集
   * @return Array [identifier]
   */
  identifierArr: state => {
    return state.baseData.funcDefine.map(model => model.identifier);
  },
  /**
   * @description funcDefine的map版本
   * @return Object {identifier: model}
   */
  funcDefineMap: state => {
    const result = {};
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      result[identifier] = model;
    });
    return result;
  },
  /**
   * @description hideMap的反义，根据被隐藏的stateName获取stateName
   * @return Object {stateName: [stateName]}
   */
  hideMapReverse: state => {
    const result = {};
    Object.keys(state.baseData.hideMap).forEach(stateName => {
      // 提取被隐藏的state
      state.baseData.hideMap[stateName].forEach(hideStateName => {
        result[hideStateName] ? result[hideStateName].push(stateName) : (result[hideStateName] = [stateName]);
      });
    });
    return result;
  },
  /**
   * @description 根据identifier与value获取当前statusName
   * @return Object {identifier: {value: statusName}}
   */
  valToStatusName: (state, getters, rootState, rootGetters) => {
    const result = {};
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      result[identifier] = getStatusName({ state, getters, rootGetters }, model, true);
    });
    return result;
  },
  /**
   * @description 根据identifier与value获取当前statusName（没经过隐藏关系处理）
   * @return Object {identifier: {value: statusName}}
   */
  valToRealStatusName: (state, getters, rootState, rootGetters) => {
    const result = {};
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      result[identifier] = getStatusName({ state, getters, rootGetters }, model, false);
    });
    return result;
  },
  /**
   * @description 根据identifier获取statusName列表
   * @return Object: {identifier: [statusName]}
   */
  statusNameMap: state => {
    const result = {};
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      result[identifier] = Object.keys(model.statusDefine);
    });
    return result;
  },
  /**
   * @description 根据identifier获取当前状态的更多信息
   * @return Object: {identifier: {statusName, stateName, status}}
   */
  statusMap: (state, getters, rootState, rootGetters) => {
    const result = {};
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      const json = model.json;
      const currentVal = rootGetters.inputMap[json];
      let statusName = getters.valToStatusName[identifier][currentVal];
      let status = model.statusDefine[statusName];
      if (!status) {
        statusName = 'default';
        status = model.statusDefine[statusName];
      }
      const stateName = `${identifier}_${statusName}`;
      const realStatusName = getters.valToRealStatusName[identifier][currentVal];
      const realStateName = `${identifier}_${realStatusName}`;
      const realStatus = model.statusDefine[realStatusName];
      result[identifier] = {
        statusName,
        stateName,
        status,
        realStatusName,
        realStateName,
        realStatus
      };
    });
    return result;
  },
  /**
   * @description stateName对应的identifier
   * @return Object: {stateName: identifier}
   */
  stateNameToId: (state, getters) => {
    const result = {};
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      getters.statusNameMap[identifier].forEach(statusName => {
        const stateName = `${identifier}_${statusName}`;
        result[stateName] = identifier;
      });
    });
    return result;
  },
  /**
   * @description 隐藏的stateName列表
   * @return Array: [stateName]
   */
  hideStateNameArr: (state, getters) => {
    const result = [];
    getters.identifierArr.forEach(identifier => {
      const statusName = getters.statusMap[identifier].statusName;
      const stateName = `${identifier}_${statusName}`;
      if (state.baseData.hideMap[stateName]) {
        result.push(...state.baseData.hideMap[stateName]);
      }
    });
    return result;
  },
  /**
   * @description status循环
   * @return Object: {identifier: [statusName]}
   */
  statusLoop: (state, getters) => {
    const result = {};
    // 设定规则，undefined不能被指向，会被重新指向为default
    const rule = statusName => {
      let result = statusName || 'default';
      result === 'undefined' && (result = 'default');
      return result;
    };
    // 遍历功能，提取status关系
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      const map = model.map; // 指向关系
      let statusName = getters.statusMap[identifier].statusName; // function的当前status
      const statusNameArr = []; // status顺序数组形式
      const checkStatusNameArr = []; // 已检查的状态
      if (map) {
        let directionStatusName = rule(map[statusName]); // status指向
        // 再次指向原点时推出，形成闭环
        while (!checkStatusNameArr.includes(directionStatusName)) {
          statusName = directionStatusName; // 下一个status
          const state = `${identifier}_${statusName}`;
          getters.hideStateNameArr.includes(state) || statusNameArr.push(directionStatusName); // 按顺序存入数组
          checkStatusNameArr.push(directionStatusName); // 按顺序存入数组
          directionStatusName = rule(map[statusName]) || 'default'; // 更新status指向
        }
      } else {
        statusNameArr.push(statusName);
      }
      result[identifier] = statusNameArr;
    });
    return result;
  },
  /**
   * @description function的当前指向statusName
   * @return Object: {identifier: statusName}
   */
  statusDirectionMap: (state, getters) => {
    const result = {};
    // 遍历功能，提取function当前指向statusName
    getters.identifierArr.forEach(identifier => {
      const directionStatusName = getters.statusLoop[identifier].find(statusName => {
        const stateName = `${identifier}_${statusName}`; // 获取指向stateName
        return !getters.hideStateNameArr.includes(stateName); // 如果没被隐藏，则返回
      });
      result[identifier] = directionStatusName || getters.statusMap[identifier].statusName; // 如果都被隐藏， 则返回当前status
    });
    return result;
  },
  /**
   * @description 没有指向的function
   * @return Array: [identifier]
   */
  noDirectionFuncArr: (state, getters) => {
    const result = getters.identifierArr.filter(identifier => {
      const statusName = getters.statusMap[identifier].statusName; // function的当前statusName
      const directionStatusName = getters.statusDirectionMap[identifier]; // function的指向statusName
      return statusName === directionStatusName;
    });
    return result;
  },
  /**
   * @description 输入被隐藏的model的identifier，返回参与隐藏的model的identifier
   * @return Object: {identifier: {stateName: stateName}}
   */
  hideByStateNameMap: (state, getters) => {
    const result = {};
    getters.noDirectionFuncArr.forEach(identifier => {
      const statusNameArr = getters.statusLoop[identifier]; // 获取status指向数组
      result[identifier] = {};
      if (statusNameArr.length >= 1) {
        // 轮询每个statusName指向
        statusNameArr.forEach(statusName => {
          const stateName = `${identifier}_${statusName}`;
          const stateNameArr = getters.hideMapReverse[stateName];
          stateNameArr && (result[identifier] = { ...result[identifier], [stateName]: stateNameArr });
        });
      }
    });
    return result;
  },
  /**
   * @description 某一status的详细信息
   * @return Object: {identifier: {statusName: {statusName, status, json, setData, customize}}}
   */
  statusInfoMap: (state, getters) => {
    const result = {};
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      const json = model.json;
      result[identifier] = {};
      getters.statusNameMap[identifier].forEach(statusName => {
        const status = model.statusDefine[statusName];
        if (!status) return;
        const customize = status.customize;
        const moreCommand = status.moreCommand;
        let setData = moreCommand || {};
        setData[json] = status.value;
        result[identifier][statusName] = {
          statusName,
          status,
          json,
          setData,
          customize
        };
      });
    });
    return result;
  },
  /**
   * @description 指向status的详细信息
   * @return Object: {identifier: {statusName, status, json, setData, customize}}
   */
  nextStatusInfoMap: (state, getters) => {
    const result = {};
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      const json = model.json;
      let statusName = getters.statusDirectionMap[identifier]; // model的指向statusName
      let status = model.statusDefine[statusName];
      if (!status) {
        statusName = 'default';
        status = model.statusDefine[statusName];
      }
      const customize = status.customize;
      const moreCommand = status.moreCommand;
      let setData = moreCommand || {};
      setData[json] = status.value;
      result[identifier] = {
        statusName,
        status,
        json,
        setData,
        customize
      };
    });
    return result;
  }
};

/** function */

/**
 * @description 获取对象之间的关系
 * @return Number 0.相离 1.相交 2.被包含 3.包含 4.相等
 */
function mapRelation(fromMap, toMap) {
  const fromMapKey = Object.keys(fromMap);
  const fromLen = fromMapKey.length;
  const toMapKey = Object.keys(toMap);
  const toLen = toMapKey.length;
  let num = 0;
  fromMapKey.forEach(item => {
    if (fromMap[item] === toMap[item]) {
      num += 1;
    }
  });
  if (!num) {
    return 0;
  } else if (fromLen - num) {
    if (num === toLen) return 3;
    return 1;
  } else if (fromLen < toLen) {
    return 2;
  }
  return 4;
}
/**
 * @description 获取function的statusName
 * @input model: 功能， isHide： 是否考虑被隐藏的stateName
 * @return Object {value: statusName}
 */
function getStatusName({ state, getters, rootGetters }, model, checkHide = false) {
  const result = {};
  const hideStateNameArr = JSON.parse(state.deriveData.hideStateNameJson); // 获取被隐藏的stateName
  const identifier = model.identifier;
  const statusNameArr = getters.statusNameMap[identifier];
  // result[identifier] = {};
  statusNameArr.forEach(statusName => {
    if (statusName === 'undefined') return;
    const stateName = `${identifier}_${statusName}`;
    if (checkHide && hideStateNameArr.includes(stateName)) {
      // 被隐藏的state不参与计算
      return;
    }
    const val = model.statusDefine[statusName].value;
    const beforeStatusName = result[val];
    // 是否存在同源状态（JSON取值相等）
    if (beforeStatusName) {
      const commandBefore = model.statusDefine[beforeStatusName].moreCommand;
      const commandCurrent = model.statusDefine[statusName].moreCommand;
      const currentType = mapRelation(commandCurrent, rootGetters.inputMap);
      // 同源状态是否有moreCommand
      if (commandBefore) {
        const beforeType = mapRelation(commandBefore, rootGetters.inputMap); // 状态是否满足
        let isCurrent = false;
        // 判断两个同源状态之间的关系
        switch (mapRelation(commandCurrent, commandBefore)) {
          // 难点重点，看悟性了
          case 0:
          case 1:
            switch (currentType) {
              case 0:
                isCurrent = beforeType === 0;
                break;
              case 1:
                isCurrent = beforeType !== 2;
                break;
              default:
                isCurrent = true;
                break;
            }
            break;
          case 2:
            switch (currentType) {
              case 0:
                isCurrent = beforeType === 0;
                break;
              case 2:
                isCurrent = beforeType !== 2;
                break;
              default:
                isCurrent = true;
                break;
            }
            break;
          case 3:
            switch (currentType) {
              case 1:
                isCurrent = beforeType !== 2;
                break;
              default:
                isCurrent = true;
                break;
            }
            break;
          default:
            isCurrent = true;
            break;
        }
        isCurrent && (result[val] = statusName);
      } else {
        currentType === 2 && (result[val] = statusName);
      }
    } else {
      result[val] = statusName;
    }
  });
  return result;
}
