const getters = {
  funcDefine: state => {
    return state.funcModule.funcDefineList[state.funcModule.deviceKey];
  },
  logicMap: state => {
    return state.funcModule.logicMap[state.funcModule.deviceKey];
  }
};
export default getters;