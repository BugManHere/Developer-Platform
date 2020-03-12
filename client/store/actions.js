import {
  SET_DEV_MODULE,
  SET_FUNC_DEFINE,
  POST_FUNC,
  EDIT_FUNC,
  ADD_FUNC,
  DEL_FUNC,
  SET_DONE,
} from './types';
import https from '@/https';
import { deepCopy } from "@/utils";

function updateDeviceList({ commit, state }, key, funcDefine) {
  const hasDeviceList = deepCopy(state.devModule.hasDeviceList)
  hasDeviceList.find(item => item._id = key).funcDefine = funcDefine;
  commit(SET_DEV_MODULE,['hasDeviceList', hasDeviceList]);
}

export default {
  // 用于更新功能
  // eslint-disable-next-line
  async [POST_FUNC]({ commit, state }, obj) {
    const funcDefine = JSON.parse(obj.funcDefine);
    const len = funcDefine.length;
    const nameMap = new Map;
    const idMap = new Map;
    for (let i = 0; i < len; i += 1) {
      if (nameMap.get(funcDefine[i].name)) return window.myvm.$toast.error(`保存失败，功能名称重复：“${funcDefine[i].name}”`);
      else nameMap.set(funcDefine[i].name, true);
      if (idMap.get(funcDefine[i].identifier)) return window.myvm.$toast.error(`保存失败，标识符重复：“${funcDefine[i].identifier}”`);
      else idMap.set(funcDefine[i].identifier, true);
    }
    const res = await https.fetchPost("/device/save", obj);
    // 更新hasDeviceList
    updateDeviceList({ commit, state }, obj.key, funcDefine);
    return res.status === 200;
  },
  // 编辑功能
  async [EDIT_FUNC]({ commit, state }, obj) {
   const  res = await https.fetchPost("/device/editFunc", obj);
    if (res.status === 200) {
      // 更新funcDefine
      const funcDefine = JSON.parse(obj.funcDefine);
      commit(SET_FUNC_DEFINE, [obj.key, funcDefine]);
      // 更新hasDeviceList
      updateDeviceList({ commit, state }, obj.key, funcDefine);
      return true;
    }
    return false;
  },
  // 增加功能
  async [ADD_FUNC]({ commit, state }, obj) {
    const res = await https.fetchPost("/device/pushFunc", obj)
    if (res.status === 200) {
      // 更新更新funcDefine
      const funcDefine = deepCopy(state.funcModule.funcDefineList)[obj.key];
      const insertMap = JSON.parse(obj.insertMap);
      funcDefine.push(insertMap);
      commit(SET_FUNC_DEFINE, [obj.key, funcDefine]);
      // 更新hasDeviceList
      updateDeviceList({ commit, state }, obj.key, funcDefine);
      return true;
    }
    return false;
  },
  // 删除功能
  async [DEL_FUNC]({ commit, state }, obj) {
    const res = await https.fetchPost("/device/delFunc", obj);
    if (res.status === 200) {
      
      window.myvm.$toast.info('删除成功');
      // 更新更新funcDefine
      const funcDefine = deepCopy(state.funcModule.funcDefineList)[obj.key];
      funcDefine.splice(obj.index, 1);
      commit(SET_FUNC_DEFINE, [obj.key, funcDefine]);
      // 更新hasDeviceList
      updateDeviceList({ commit, state }, obj.key, funcDefine);
      return true;
    }
    return false;
  },
  // 配置完毕
  // eslint-disable-next-line
  async [SET_DONE]({}, obj) {
    const res = await https.fetchPost("/device/done", obj);
    return res.status === 200;
  }
};
