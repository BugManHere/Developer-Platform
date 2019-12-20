import {
  SET_FUNC_DEFINE,
  SET_FUNC_OBJECT,
  POST_FUNC,
  ADD_FUNC,
  DEL_FUNC
} from './types';
import https from '@/https';
import { deepCopy } from "@/utils";

export default {
  // 上传功能列表
  // eslint-disable-next-line
  async [POST_FUNC]({}, obj) {
    await https.fetchPost("/device/save", obj);
  },
  // 增加功能
  async [ADD_FUNC]({ commit, state }, obj) {
    const res = await https.fetchPost("/device/pushFunc", obj)
    if (res.status === 200) {
      let funcDefineList = deepCopy(state.funcModule.funcDefineList);
      const insertMap = JSON.parse(obj.insertMap);
      funcDefineList[obj.key].push(insertMap);
      commit(SET_FUNC_DEFINE, [obj.key, funcDefineList[obj.key]]);
      return true;
    }
  },
  // 删除功能
  async [DEL_FUNC]({ commit, state }, obj) {
    const res = await https.fetchPost("/device/delFunc", obj);
    res.status === 200 && window.myvm.$toast.info('删除成功');
    if (res.status === 200) {
      let funcDefineList = deepCopy(state.funcModule.funcDefineList);
      funcDefineList[obj.key].splice(obj.index, 1);
      commit(SET_FUNC_OBJECT, ['funcDefineList', funcDefineList]);
      return true;
    }
  }
};
