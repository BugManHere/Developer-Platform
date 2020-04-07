import {
  SET_DEV_MODULE, // mutations方法，设置devModule的内容
  CHANGE_TEMPLATE, // mutations方法，设置devModule的内容
  SET_PULIC_MODULE, // mutations方法，设置pulicModule的内容
  GET_PRODUCT_TYPE_LIST,
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
// import { deepCopy } from "@/utils";

export default {
  // 获取产品类别列表
  async [GET_PRODUCT_TYPE_LIST]({ commit }) {
    const res = await https.fetchGet("/productType");
    const status = res.status === 200;
    status && commit(SET_PULIC_MODULE, ['productTypeList', res.data]);
    return status;
  },
  // 模板更新功能（暂存）
  async [SAVE_TEMP_FUNC]({ state, getters, commit }) {
    const funcDefine = getters.funcDefine;
    const len = funcDefine.length;
    const nameMap = new Map;
    const idMap = new Map;
    // 查重
    for (let i = 0; i < len; i += 1) {
      if (nameMap.get(funcDefine[i].name)) return window.myvm.$toast.error(`保存失败，功能名称重复：“${funcDefine[i].name}”`);
      else nameMap.set(funcDefine[i].name, true);
      if (idMap.get(funcDefine[i].identifier)) return window.myvm.$toast.error(`保存失败，标识符重复：“${funcDefine[i].identifier}”`);
      else idMap.set(funcDefine[i].identifier, true);
    }
    // 请求接口，返回：template
    const res = await https.fetchPost("/template/save", {
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
      funcDefine: JSON.stringify(getters.funcDefine),
      tempID: state.tempModule.tempID
    });
    commit(CHANGE_TEMPLATE, res.data);
    const status = res.status === 200;
    status && window.myvm.$toast.info('保存成功');
    return status;
  },
  // 删除设备
  async [DEL_DEV]({ state, commit }, id) {
    const res = await https.fetchPost('/userDevice/delDevice', { 
      id, 
      admin: state.userModule.admin, 
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('删除设备成功') && commit(SET_DEV_MODULE, ['hasDeviceList', res.data]);
    return status;
  },
  // 设备删除功能
  async [DEL_DEV_FUNC]({ state, commit }, index) {
    const res = await https.fetchPost("/userDevice/delFunc", {
      admin: state.userModule.admin, 
      index,
      id: state.devModule.deviceKey,
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('删除成功') && commit(SET_DEV_MODULE, ['hasDeviceList', res.data]);
    return status;
  },
  // 设备配置完毕
  async [SET_DEV_DONE]({ state, getters }) {
    const res = await https.fetchPost("/userDevice/done", {
      admin: state.userModule.admin, 
      id: state.devModule.deviceKey,
      funcImport: getters.funcImport
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('保存成功');
    return status;
  },
};
