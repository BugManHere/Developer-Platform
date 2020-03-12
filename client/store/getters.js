const getters = {
  // 根据id进行搜索的功能列表
  productFuncInfoById: state => {
    const result = {};
    state.devModule.productFunc.forEach(item => {
      const map = {
        identifier: item.identifier, 
        name: item.name, 
        json: item.json, 
        define: item
      };
      if (result[item.identifier]) {
        result[item.identifier].push(map);
      } else {
        result[item.identifier] = [map];
      }
    });
    return result;
  },
  productFuncInfoByName: state => {
    const result = {};
    state.devModule.productFunc.forEach(item => {
      const map = {
        identifier: item.identifier, 
        name: item.name, 
        json: item.json, 
        define: item
      };
      if (result[item.name]) {
        result[item.name].push(map);
      } else {
        result[item.name] = [map];
      }
    });
    return result;
  },
  productFuncInfoByJson: state => {
    const result = {};
    state.devModule.productFunc.forEach(item => {
      const map =  {
        identifier: item.identifier, 
        name: item.name, 
        json: item.json, 
        define: item
      };
      if (result[item.json]) {
        result[item.json].push(map);
      } else {
        result[item.json] = [map];
      }
    });
    return result;
  },
  funcDefine: state => {
    return state.funcModule.funcDefineList[state.funcModule.deviceKey];
  },
  // excludeMap: state => {
  //   return state.funcModule.excludeMap[state.funcModule.deviceKey];
  // },
  // hideMap: state => {
  //   return state.funcModule.hideMap[state.funcModule.deviceKey];
  // },
  // disableMap: state => {
  //   return state.funcModule.disableMap[state.funcModule.deviceKey];
  // },
  labelList: (state, getters) => {
    const result = [];
    getters.funcDefine.forEach((funcItem, funcIndex) => {
      const statusDefine = funcItem.statusDefine;
      ['undefined', 'default', ...funcItem.order].forEach(item => {
        if (statusDefine[item].isCheck) {
          result.push({
            identifier: funcItem.identifier,
            name: `${funcItem.name}（${statusDefine[item].name}）`,
            index: funcIndex,
            statusName: item,
          });
        }
      });
    }); 
    return result;
  }
};
export default getters;