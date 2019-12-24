const getters = {
  funcDefine: state => {
    return state.funcModule.funcDefineList[state.funcModule.deviceKey];
  },
  logicMap: state => {
    return state.funcModule.logicMap[state.funcModule.deviceKey];
  },
  labelList: (state, getters) => {
    const result = [];
    getters.funcDefine.forEach((funcItem, funcIndex) => {
      const statusDefine = funcItem.statusDefine;
      ['undefined', ...funcItem.order].forEach(item => {
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