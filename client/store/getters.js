const getters = {
  productInfo: state => {
    if (!state.tempModule.templates.length || !state.tempModule.productID || !state.tempModule.seriesID) return {};
    return state.tempModule.templates.filter(item => item.productID === state.tempModule.productID).find(item => item.seriesID === state.tempModule.seriesID);
  },
  funcDefine: (state, getters) => {
    return getters.productInfo.funcDefine;
  },
  currentDevice: state => {
    return state.devModule.userDeviceList.find(item => item._id === state.devModule.deviceKey);
  },
  funcImport: (state, getters) => {
    if (!getters.currentDevice) return [];
    return getters.currentDevice.funcImport;
  },
  // 根据id进行搜索的功能列表
  productFuncInfoById: (state, getters) => {
    const result = {};
    getters.funcDefine.forEach(item => {
      const map = {
        identifier: item.identifier,
        name: item.name,
        json: item.json,
        _id: item._id,
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
  productFuncInfoByName: (state, getters) => {
    const result = {};
    getters.funcDefine.forEach(item => {
      const map = {
        identifier: item.identifier,
        name: item.name,
        json: item.json,
        _id: item._id,
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
  productFuncInfoByJson: (state, getters) => {
    const result = {};
    getters.funcDefine.forEach(item => {
      const map = {
        identifier: item.identifier,
        name: item.name,
        json: item.json,
        _id: item._id,
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
  // 标签池
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
            statusName: item
          });
        }
      });
    });
    return result;
  }
};
export default getters;
