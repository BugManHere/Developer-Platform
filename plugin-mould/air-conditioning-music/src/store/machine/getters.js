/** stateMachine */
export default {
  /**
   * @description 定义为显性功能的model合集
   * @return Array [model]
   */
  funcDefine_active: state => {
    return state.baseData.funcDefine.filter(model => model.type.includes('active'));
  },
  /**
   * @description 定义为隐性功能的model合集
   * @return Array [model]
   */
  funcDefine_inertia: state => {
    return state.baseData.funcDefine.filter(model => model.type.includes('inertia'));
  },
  /**
   * @description 所有model的identifier合集
   * @return Array [identifier]
   */
  identifierArr: state => {
    return state.baseData.funcDefine.map(model => model.identifier);
  },
  /**
   * @description funcDefine的map版本，根据identifier找到对应的model
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
   * @description hideMap的反义，根据被隐藏的stateName找到具有隐藏关系的stateName合集
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
   * @description 根据identifier与value获取statusName
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
   * @description 根据identifier与value获取statusName，没有经过隐藏状态处理
   * @return Object {identifier: {value: statusName}}
   */
  valToFakeStatusName: (state, getters, rootState, rootGetters) => {
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
      result[identifier] = Object.keys(model.statusDefine).filter(statusName => statusName !== 'undefined');
    });
    return result;
  },
  /**
   * @description 根据identifier获取stateName列表
   * @return Object: {identifier: [stateName]}
   */
  stateNameMap: (state, getters) => {
    const result = {};
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      result[identifier] = getters.statusNameMap[identifier].map(statusNmae => {
        return `${identifier}_${statusNmae}`;
      });
    });
    return result;
  },
  /**
   * @description 根据identifier获取当前状态的更多信息，没有经过隐藏状态处理
   * @return Object: {identifier: {statusName, stateName, status}}
   */
  $_statusMap: (state, getters, rootState, rootGetters) => {
    const result = {};
    // 根据字段值，返回当前状态信息
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      const json = model.json;
      // 字段值
      const currentVal = rootGetters.inputMap[json];
      // 当前statusName
      let statusName = getters.valToStatusName[identifier][currentVal];
      let status = model.statusDefine[statusName];
      // 如果statusName不存在，返回'undefined'
      if (!status) {
        statusName = 'undefined';
        status = model.statusDefine.undefined;
      }
      // 当前stateName
      const stateName = `${identifier}_${statusName}`;
      result[identifier] = {
        statusName,
        stateName,
        status
      };
    });
    return result;
  },
  /**
   * @description 根据identifier获取当前状态的更多信息，经过一层隐藏状态处理
   * @return Object: {identifier: {statusName, stateName, status}}
   */
  statusMap: (state, getters) => {
    const result = {};
    // 获取当前被隐藏的stateName
    const hideStateNameArr = getters.hideStateNameArr;
    // 根据被隐藏的stateName，重新获取当前状态信息
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      // 获取未经过隐藏状态处理的状态信息
      let { statusName, stateName, status } = getters.$_statusMap[identifier];
      // 如果状态被隐藏
      if (hideStateNameArr.includes(stateName)) {
        // 获取新的指向
        const directionStatusName = getters.statusDirectionMap[identifier]; // model的指向statusName
        // 如果没有指向，则返回'undefined'
        statusName = statusName === directionStatusName ? 'undefined' : directionStatusName;
        stateName = `${identifier}_${statusName}`;
        status = model.statusDefine[statusName];
      }
      result[identifier] = {
        statusName: String(statusName),
        stateName,
        status
      };
    });
    return result;
  },
  /**
   * @description 根据identifier获取当前状态的更多信息，没有经过隐藏状态处理
   * @return Object: {identifier: {statusName, stateName, status}}
   */
  fakeStatusMap: (state, getters, rootState, rootGetters) => {
    const result = {};
    // 根据字段值，返回当前状态信息
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      const json = model.json;
      // 字段值
      const currentVal = rootGetters.inputMap[json];
      // 当前statusName
      let statusName = getters.valToFakeStatusName[identifier][currentVal];
      let status = model.statusDefine[statusName];
      // 如果statusName不存在，返回'undefined'
      if (!status) {
        statusName = 'undefined';
        status = model.statusDefine.undefined;
      }
      // 当前stateName
      const stateName = `${identifier}_${statusName}`;
      result[identifier] = {
        statusName,
        stateName,
        status
      };
    });
    return result;
  },
  /**
   * @description 根据stateName获取对应的identifier
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
   * @description 隐藏的stateName数组
   * @return Array: [stateName]
   */
  hideStateNameArr: (state, getters) => {
    const result = [];
    getters.identifierArr.forEach(identifier => {
      const statusName = getters.$_statusMap[identifier].statusName;
      const stateName = `${identifier}_${statusName}`;
      if (state.baseData.hideMap[stateName]) {
        result.push(...state.baseData.hideMap[stateName]);
      }
    });
    state.deriveData.hideStateNameJson = JSON.stringify(result);
    return result;
  },
  /**
   * @description 根据identifier获取statusName指向关系
   * @return Object: {identifier: [statusName]}
   */
  statusLoop: (state, getters) => {
    const result = {};
    // 遍历功能，提取status关系
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      // 指向关系
      const map = model.map;
      // 当前statusName
      let statusName = getters.$_statusMap[identifier].statusName;
      // 存放statusName用
      const statusNameArr = [];
      // 存放已检查的statusName用
      const checkStatusNameArr = [];
      if (map) {
        // status指向
        let directionStatusName = String(map[statusName]);
        // 再次指向原点时推出，形成闭环
        while (!checkStatusNameArr.includes(directionStatusName)) {
          // 下一个statusName
          statusName = directionStatusName;
          const stateName = `${identifier}_${statusName}`;
          // 按顺序存入数组
          getters.hideStateNameArr.includes(stateName) || statusNameArr.push(directionStatusName);
          checkStatusNameArr.push(directionStatusName);
          // 更新指向
          directionStatusName = String(map[statusName]);
        }
      }
      // 无意义的指向改为'undefined'
      statusNameArr.length === 0 && statusNameArr.push('undefined');
      result[identifier] = statusNameArr;
    });
    return result;
  },
  /**
   * @description 根据identifier获取statusName指向关系
   * @return Object: {identifier: [statusName]}
   */
  fakeStatusLoop: (state, getters) => {
    const result = {};
    // 遍历功能，提取status关系
    state.baseData.funcDefine.forEach(model => {
      const identifier = model.identifier;
      // 指向关系
      const map = model.map;
      // 当前statusName
      let statusName = getters.$_statusMap[identifier].statusName;
      // 存放statusName用
      const statusNameArr = [];
      // 存放已检查的statusName用
      const checkStatusNameArr = [];
      if (map) {
        // status指向
        let directionStatusName = String(map[statusName]);
        // 再次指向原点时推出，形成闭环
        while (!checkStatusNameArr.includes(directionStatusName)) {
          // 下一个statusName
          statusName = directionStatusName;
          // 按顺序存入数组
          statusNameArr.push(directionStatusName);
          checkStatusNameArr.push(directionStatusName);
          // 更新指向
          directionStatusName = String(map[statusName]);
        }
      }
      // 无意义的指向改为'undefined'
      statusNameArr.length === 0 && statusNameArr.push('undefined');
      result[identifier] = statusNameArr;
    });
    return result;
  },
  /**
   * @description model的当前指向statusName
   * @return Object: {identifier: statusName}
   */
  statusDirectionMap: (state, getters) => {
    const result = {};
    // 遍历功能，提取model当前指向statusName
    getters.identifierArr.forEach(identifier => {
      const directionStatusName = getters.statusLoop[identifier].find(statusName => {
        const stateName = `${identifier}_${statusName}`; // 获取指向stateName
        return !getters.hideStateNameArr.includes(stateName); // 如果没被隐藏，则返回
      });
      result[identifier] = directionStatusName || getters.$_statusMap[identifier].statusName; // 如果都被隐藏， 则返回当前status
    });
    return result;
  },
  /**
   * @description 获取没有指向的model数组
   * @return Array: [identifier]
   */
  blindModelArr: (state, getters) => {
    const result = getters.identifierArr.filter(identifier => {
      // 当前statusName
      const statusName = getters.statusMap[identifier].statusName;
      // 指向statusName
      const directionStatusName = getters.statusDirectionMap[identifier];
      // 如果指向statusName为'undefined'或当前statusName，则认为指向无效
      return directionStatusName === 'undefined' || directionStatusName === statusName;
    });
    return result;
  },
  // /**
  //  * @description 输入被隐藏的model的identifier，返回参与隐藏的model的identifier
  //  * @return Object: {identifier: {stateName: stateName}}
  //  */
  // hideByStateNameMap: (state, getters) => {
  //   const result = {};
  //   getters.blindModelArr.forEach(identifier => {
  //     const statusNameArr = getters.statusLoop[identifier]; // 获取status指向数组
  //     result[identifier] = {};
  //     if (statusNameArr.length >= 1) {
  //       // 轮询每个statusName指向
  //       statusNameArr.forEach(statusName => {
  //         const stateName = `${identifier}_${statusName}`;
  //         const stateNameArr = getters.hideMapReverse[stateName];
  //         stateNameArr && (result[identifier] = { ...result[identifier], [stateName]: stateNameArr });
  //       });
  //     }
  //   });
  //   return result;
  // },
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
        statusName: String(statusName),
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
      console.log('xxxx', fromMap[2], toMap[2]);
      console.log('qqq', num);
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
 * @description 获取model的statusName
 * @input {Object} model: 功能
 * @input {Boolean} checkHide: 是否考虑被隐藏的stateName
 * @return Object {value: statusName}
 */
function getStatusName({ state, getters, rootGetters }, model, checkHide = false) {
  const result = {};
  // 获取被隐藏的stateName
  const hideStateNameArr = JSON.parse(state.deriveData.hideStateNameJson);
  console.log('1', state.deriveData.hideStateNameJson);
  const identifier = model.identifier;
  console.log('2', identifier);
  // 根据identifier获取statusName列表
  const statusNameArr = getters.statusNameMap[identifier];
  console.log('3', statusNameArr);
  console.log('4', getters.statusNameMap);
  // result[identifier] = {};
  statusNameArr.forEach(statusName => {
    if (statusName === 'undefined') return;
    const stateName = `${identifier}_${statusName}`;
    console.log('5', stateName);
    // 隐藏的状态不参与
    if (checkHide && hideStateNameArr.includes(stateName)) {
      return;
    }
    const val = model.statusDefine[statusName].value;
    console.log('6', model.statusDefine);
    console.log('7', val);
    const beforeStatusName = result[val];
    console.log('8', beforeStatusName);
    // 是否存在同源状态（JSON取值相等）
    if (beforeStatusName) {
      const commandBefore = model.statusDefine[beforeStatusName].moreCommand;
      console.log('9', commandBefore);
      const commandCurrent = model.statusDefine[statusName].moreCommand;
      console.log('10', commandCurrent);
      const currentType = mapRelation(commandCurrent, rootGetters.inputMap);
      console.log('11', currentType);
      console.log('12', rootGetters.inputMap);
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
