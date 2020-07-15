import {
  SET_DEV_MODULE, // mutations方法，设置devModule的内容
  SET_TEMP_MODULE, // mutations方法，设置tempModule的内容
  SET_PULIC_MODULE, // mutations方法，设置pulicModule的内容
  CHANGE_TEMPLATE, // mutations方法，改变templates的内容

  GET_PRODUCT_TYPE_LIST, // 获取产品类别列表
  GET_USERDEVICE_LIST, // 获取用户设备列表
  GET_TEMPLATES, // 获取模板信息

  DEL_DEV,
  SAVE_TEMP_FUNC,
  EDIT_TEMP_FUNC,
  ADD_TEMP_FUNC,
  DEL_TEMP_FUNC,
  SET_TEMP_DONE,
  DEL_DEV_FUNC,
  SET_DEV_DONE,
} from './types';
import https from '@/https';

export default {
  // 获取产品类别列表
  // [return Boolean] true: 获取成功， false: 获取失败
  async [GET_PRODUCT_TYPE_LIST]({ state, commit }) {
    const productTypeList = window.storage.get('productTypeList'); // 获取localStorage里缓存的数据
    if (Object.keys(state.pulicModule.productTypeList).length) { // 如果已经有数据，返回不操作
      return true; 
    } else if (productTypeList) { // 如果缓存里有数据
      commit(SET_PULIC_MODULE, ['productTypeList', productTypeList]); // 获取缓存的数据
      return true; 
    }
    const res = await https.fetchGet("/productType"); // 从后端获取数据
    const status = res.status === 200;
    // 如果获取后端数据成功，保存到本地和缓存
    if (status) { 
      commit(SET_PULIC_MODULE, ['productTypeList', res.data]); 
      window.storage.set('productTypeList', res.data, 30); // 保存到localstorage，设定30分钟后失效
    }
    return status;
  },
  // 获取用户设备列表
  async [GET_USERDEVICE_LIST]({ state, commit }) {
    await https.fetchPost("/userDevice", {
      admin: state.userModule.admin, 
    }).then(res => {
      const status = res.status === 200;
      status && commit(SET_DEV_MODULE, ['userDeviceList', res.data]);
      return status;
    });
  },
   // 获取模板信息
  async [GET_TEMPLATES]({ state, commit }) {
    if (state.tempModule.templates.length) return true;
    const res = await https.fetchGet("/template");
    const status = res.status === 200;
    status && commit(SET_TEMP_MODULE, ['templates', res.data]);
    return status;
  },
  // 模板更新功能（暂存）
  async [SAVE_TEMP_FUNC]({ state, getters, commit }) {
    const funcDefine = getters.funcDefine;
    const len = funcDefine.length;
    // const nameMap = new Map;
    const idMap = new Map;
    // 查重
    for (let i = 0; i < len; i += 1) {
      // if (nameMap.get(funcDefine[i].name)) return window.myvm.$toast.error(`保存失败，功能名称重复：“${funcDefine[i].name}”`);
      // else nameMap.set(funcDefine[i].name, true);
      if (idMap.get(funcDefine[i].identifier)) return window.myvm.$toast.error(`保存失败，标识符重复：“${funcDefine[i].identifier}”`);
      else idMap.set(funcDefine[i].identifier, true);
    }
    // 请求接口，返回：template
    const res = await https.fetchPost("/template/save", {
      admin: state.userModule.admin, 
      funcDefine: JSON.stringify(funcDefine), 
      tempID: state.tempModule.tempID,
    });
    commit(CHANGE_TEMPLATE, res.data);
    const status = res.status === 200;
    status && window.myvm.$toast.info('暂存成功');
    return status;
  },
  // 模板编辑功能（更新某一功能），传入funcDefine
  async [EDIT_TEMP_FUNC]({ state, commit }, subFuncDefine) {
    const  res = await https.fetchPost("/template/editFunc", {
      admin: state.userModule.admin, 
      subFuncDefine: JSON.stringify(subFuncDefine),
      tempID: state.tempModule.tempID,
    });
    const status = res.status === 200;
    status && commit(CHANGE_TEMPLATE, res.data);
    return status;
  },
  // 模板增加功能
  async [ADD_TEMP_FUNC]({ state, commit }, insertMap) {
    const res = await https.fetchPost("/template/addFunc", {
      admin: state.userModule.admin, 
      insertMap: JSON.stringify(insertMap),
      tempID: state.tempModule.tempID,
    })
    const status = res.status === 200;
    status &&  commit(CHANGE_TEMPLATE, res.data);
    return status;
  },
  // 模板删除功能
  async [DEL_TEMP_FUNC]({ state, commit }, index) {
    const res = await https.fetchPost("/template/delFunc", {
      admin: state.userModule.admin, 
      index,
      tempID: state.tempModule.tempID,
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('删除成功') && commit(CHANGE_TEMPLATE, res.data);
    return status;
  },
  // 模板配置完毕
  async [SET_TEMP_DONE]({ state, getters, commit }) {
    const res = await https.fetchPost("/template/done", {
      admin: state.userModule.admin, 
      funcDefine: JSON.stringify(getters.funcDefine),
      tempID: state.tempModule.tempID,
    });
    commit(CHANGE_TEMPLATE, res.data);
    const status = res.status === 200;
    status && window.myvm.$toast.info('保存成功');
    return status;
  },
  // 删除设备
  async [DEL_DEV]({ state, commit }, id) {
    const res = await https.fetchPost('/userDevice/delDevice', { 
      admin: state.userModule.admin, 
      id,
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('删除设备成功') && commit(SET_DEV_MODULE, ['userDeviceList', res.data]);
    return status;
  },
  // 设备删除功能
  async [DEL_DEV_FUNC]({ state, commit, getters }, index) {
    const funcId = getters.funcImport[index];
    const res = await https.fetchPost("/userDevice/delFunc", {
      admin: state.userModule.admin, 
      funcId,
      id: state.devModule.deviceKey,
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('删除成功') && commit(SET_DEV_MODULE, ['userDeviceList', res.data]);
    return status;
  },
  // 设备配置完毕
  async [SET_DEV_DONE]({ state, getters }) {
    const newWin = window.open('', 'pluginPage');
    // 前端先检验：如果权限不足，则不请求接口
    if (state.userModule.user.identity <= 2) {
      await https.fetchPost("/userDevice/done", {
        admin: state.userModule.admin, 
        id: state.devModule.deviceKey,
        funcImport: getters.funcImport,
        moreOption: JSON.stringify(state.devModule.moreOption)
      });
    }
    window.myvm.$toast.info('请在新窗口预览效果');
    const targetUrl = `${process.env.VUE_APP_SERVE_URL}:8081/#/Loading?id=${state.devModule.deviceKey}&admin=${state.userModule.admin}`;
    // window.open(targetUrl, 'pluginPage', '', true);
    newWin.location.href = targetUrl;
    return status;
  },
};
