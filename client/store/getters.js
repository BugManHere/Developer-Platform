const getters = {
  productInfo: state => {
    if (!state.tempModule.templates.length || !state.tempModule.productID || !state.tempModule.seriesID) return {};
    return state.tempModule.templates.filter(item => item.productID === state.tempModule.productID).find(item => item.seriesID === state.tempModule.seriesID);
  },
  productType: state => {
    if (!state.pulicModule.productTypeList.length || !state.tempModule.productID) return {};
    return state.pulicModule.productTypeList.find(item => item._id === state.tempModule.productID);
  },
  funcDefine: (state, getters) => {
    if (getters.productInfo.funcDefine) {
      return getters.productInfo.funcDefine.map((model, index) => {
        // 给功能添加序号
        model.realIndex = index;
        return model;
      });
    }
    return [];
  },
  /**
   * @description 定义为显性功能的model合集
   * @return Array [model]
   */
  funcDefine_active: (state, getters) => {
    return getters.funcDefine.filter(model => model.type.includes('active'));
  },
  /**
   * @description 定义为隐性功能的model合集
   * @return Array [model]
   */
  funcDefine_inertia: (state, getters) => {
    return getters.funcDefine.filter(model => model.type.includes('inertia'));
  },
  typeDefine: (state, getters) => {
    return getters.productInfo.typeDefine || {};
  },
  jsonDefine: (state, getters) => {
    return getters.productInfo.jsonDefine || {};
  },
  currentDevice: state => {
    return state.devModule.userDeviceList.find(item => item._id === state.devModule.deviceKey) || {};
  },
  funcImport: (state, getters) => {
    const midType = state.devModule.midType;
    if (midType && getters.currentDevice.midTypeFunc && getters.currentDevice.midTypeFunc[midType]) {
      return getters.currentDevice.midTypeFunc[midType];
    }
    return getters.currentDevice.funcImport || [];
  },
  midTypeFunc: (state, getters) => {
    return getters.currentDevice.midTypeFunc || {};
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
      Object.keys(statusDefine).forEach(item => {
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
