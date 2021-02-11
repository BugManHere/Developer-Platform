import {
  SET_DEV_MODULE, // mutations方法，设置devModule的内容
  SET_TEMP_MODULE, // mutations方法，设置tempModule的内容
  SET_PULIC_MODULE, // mutations方法，设置pulicModule的内容
  CHANGE_TEMPLATE, // mutations方法，改变templates的内容
  GET_PRODUCT_TYPE_LIST, // 获取产品类别列表
  GET_USERDEVICE_LIST, // 获取用户设备列表
  GET_TEMPLATES, // 获取模板信息
  TYPE_DEF_EDIT, // 编辑类型定义
  ADD_JSON_DEFINE, // 新增字段类型定义
  DEL_JSON_DEFINE, // 删除字段类型定义
  GET_DEV, // 获取设备信息
  DEV_CREATE, // 创建设备
  INHERIT_DEV, // 派生设备
  DEL_DEV,
  SAVE_TEMP_FUNC,
  EDIT_TEMP_FUNC,
  ADD_TEMP_FUNC,
  DEL_TEMP_FUNC,
  SET_TEMP_DONE,
  DEV_SAVE, // 保存设备更改
  DEV_ADD_MIDTYPE, // 设备增加细分码
  DEL_DEV_FUNC,
  SET_DEV_DONE,
  DOWNLOAD_CONFIG // 下载配置
} from './types';
import https from '@/https';
import mouldConfig from '@plugin/mould-config.json';

export default {
  // 获取产品类别列表
  // [return Boolean] true: 获取成功， false: 获取失败
  async [GET_PRODUCT_TYPE_LIST]({ state, commit }) {
    const productTypeList = window.storage.get('productTypeList'); // 获取localStorage里缓存的数据
    if (Object.keys(state.pulicModule.productTypeList).length) {
      // 如果已经有数据，返回不操作
      return true;
    } else if (productTypeList) {
      // 如果缓存里有数据
      commit(SET_PULIC_MODULE, { productTypeList }); // 获取缓存的数据
      return true;
    }
    const res = await https.fetchGet('/productType'); // 从后端获取数据
    const status = res.status === 200;
    // 如果获取后端数据成功，保存到本地和缓存
    if (status) {
      commit(SET_PULIC_MODULE, { productTypeList: res.data });
      window.storage.set('productTypeList', res.data, 30); // 保存到localstorage，设定30分钟后失效
    }
    return status;
  },
  // 获取用户设备列表
  async [GET_USERDEVICE_LIST]({ state, commit }) {
    await https
      .fetchPost('/userDevice', {
        admin: state.userModule.admin
      })
      .then(res => {
        const status = res.status === 200;
        status && commit(SET_DEV_MODULE, { userDeviceList: res.data });
        return status;
      });
  },
  // 获取模板信息
  async [GET_TEMPLATES]({ state, commit }) {
    if (state.tempModule.templates.length) return true;
    const res = await https.fetchGet('/template');
    const status = res.status === 200;
    status && commit(SET_TEMP_MODULE, { templates: res.data });
    return status;
  },
  // 模板更新功能（暂存）
  async [SAVE_TEMP_FUNC]({ state, getters, commit }) {
    const funcDefine = getters.funcDefine;
    const len = funcDefine.length;
    // const nameMap = new Map;
    const idMap = new Map();
    // 查重
    for (let i = 0; i < len; i += 1) {
      // if (nameMap.get(funcDefine[i].name)) return window.myvm.$toast.error(`保存失败，功能名称重复：“${funcDefine[i].name}”`);
      // else nameMap.set(funcDefine[i].name, true);
      if (idMap.get(funcDefine[i].identifier)) return window.myvm.$toast.error(`保存失败，标识符重复：“${funcDefine[i].identifier}”`);
      else idMap.set(funcDefine[i].identifier, true);
    }
    // 请求接口，返回：template
    const res = await https.fetchPost('/template/save', {
      admin: state.userModule.admin,
      funcDefine: JSON.stringify(funcDefine),
      tempID: state.tempModule.tempID
    });
    commit(CHANGE_TEMPLATE, res.data);
    const status = res.status === 200;
    status && window.myvm.$toast.info('暂存成功');
    return status;
  },
  // 模板编辑功能（更新某一功能），传入funcDefine
  async [EDIT_TEMP_FUNC]({ state, commit }, subFuncDefine) {
    const res = await https.fetchPost('/template/editFunc', {
      admin: state.userModule.admin,
      subFuncDefine: JSON.stringify(subFuncDefine),
      tempID: state.tempModule.tempID
    });
    const status = res.status === 200;
    status && commit(CHANGE_TEMPLATE, res.data);
    return status;
  },
  // 模板增加功能
  async [ADD_TEMP_FUNC]({ state, commit }, insertMap) {
    const res = await https.fetchPost('/template/addFunc', {
      admin: state.userModule.admin,
      insertMap: JSON.stringify(insertMap),
      tempID: state.tempModule.tempID
    });
    const status = res.status === 200;
    status && commit(CHANGE_TEMPLATE, res.data);
    return status;
  },
  // 模板删除功能
  async [DEL_TEMP_FUNC]({ state, commit }, index) {
    const res = await https.fetchPost('/template/delFunc', {
      admin: state.userModule.admin,
      index,
      tempID: state.tempModule.tempID
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('删除成功') && commit(CHANGE_TEMPLATE, res.data);
    return status;
  },
  // 模板配置完毕
  async [SET_TEMP_DONE]({ state, getters, commit }) {
    const res = await https.fetchPost('/template/done', {
      admin: state.userModule.admin,
      funcDefine: JSON.stringify(getters.funcDefine),
      tempID: state.tempModule.tempID
    });
    commit(CHANGE_TEMPLATE, res.data);
    const status = res.status === 200;
    status && window.myvm.$toast.info('保存成功');
    return status;
  },
  // 编辑类型定义
  async [TYPE_DEF_EDIT]({ state, commit }, { typeDefine }) {
    const res = await https.fetchPost('/template/typeDefine/edit', {
      admin: state.userModule.admin,
      tempID: state.tempModule.tempID,
      typeDefine: JSON.stringify(typeDefine)
    });
    commit(CHANGE_TEMPLATE, res.data);
    const status = res.status === 200;
    return status;
  },
  // 新增字段类型定义
  async [ADD_JSON_DEFINE]({ state, commit }, { addJson }) {
    const res = await https.fetchPost('/template/jsonDefine/add', {
      admin: state.userModule.admin,
      tempID: state.tempModule.tempID,
      addJson: JSON.stringify(addJson)
    });
    commit(CHANGE_TEMPLATE, res.data);
    const status = res.status === 200;
    return status;
  },
  // 删除字段类型定义
  async [DEL_JSON_DEFINE]({ state, commit }, { json }) {
    const res = await https.fetchPost('/template/jsonDefine/del', {
      admin: state.userModule.admin,
      tempID: state.tempModule.tempID,
      json
    });
    commit(CHANGE_TEMPLATE, res.data);
    const status = res.status === 200;
    return status;
  },
  // 获取设备信息
  async [GET_DEV]({ state, commit }) {
    const res = await https.fetchPost('/userDevice', {
      admin: state.userModule.admin
    });
    const status = res.status === 200;
    status && commit(SET_DEV_MODULE, { userDeviceList: res.data });
    return status;
  },
  // 创建设备
  async [DEV_CREATE]({ state, commit }, { deviceInfo }) {
    const res = await https.fetchPost('/userDevice/create', {
      deviceInfo,
      admin: state.userModule.admin
    });
    const status = res.status === 200;
    status && commit(SET_DEV_MODULE, { userDeviceList: res.data });
    return true;
  },
  // 派生设备
  async [INHERIT_DEV]({ state, commit }, { id, productModel, deviceName }) {
    const res = await https.fetchPost('/userDevice/inheritDevice', {
      admin: state.userModule.admin,
      id,
      productModel,
      deviceName
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('派生设备成功') && commit(SET_DEV_MODULE, { userDeviceList: res.data });
    return status;
  },
  // 删除设备
  async [DEL_DEV]({ state, commit }, { id }) {
    const res = await https.fetchPost('/userDevice/delDevice', {
      admin: state.userModule.admin,
      id
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('删除设备成功') && commit(SET_DEV_MODULE, { userDeviceList: res.data });
    return status;
  },
  // 保存设备更改
  async [DEV_SAVE]({ state, commit }, { idList }) {
    const res = await https.fetchPost('/userDevice/save', {
      midType: state.devModule.midType,
      idList,
      id: state.devModule.deviceKey,
      admin: state.userModule.admin
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('保存成功') && commit(SET_DEV_MODULE, { userDeviceList: res.data });
  },
  // 设备删除功能
  async [DEL_DEV_FUNC]({ state, commit, getters }, { index }) {
    const funcId = getters.funcImport[index];
    const res = await https.fetchPost('/userDevice/delFunc', {
      admin: state.userModule.admin,
      midType: state.devModule.midType,
      funcId,
      id: state.devModule.deviceKey
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('删除成功') && commit(SET_DEV_MODULE, { userDeviceList: res.data });
    return status;
  },
  // 设备配置完毕
  async [SET_DEV_DONE]({ state, getters }) {
    const newWin = window.open('', 'pluginPage');
    let status = true;
    let modelPath = '';
    // 前端先检验：如果权限不足，则不请求接口
    if (state.userModule.user.identity <= 2) {
      const res = await https.fetchPost('/userDevice/done', {
        admin: state.userModule.admin,
        deviceKey: state.devModule.deviceKey,
        funcImport: getters.funcImport,
        moreOption: JSON.stringify(state.devModule.moreOption)
      });
      status = res.status === 200;
      modelPath = res.data;
    }
    const port = mouldConfig[modelPath];
    window.myvm.$toast.info('请在新窗口预览效果');
    const targetUrl = `${process.env.VUE_APP_SERVE_URL}:${port}/#/Loading?id=${state.devModule.deviceKey}&admin=${state.userModule.admin}&MidType=${state.devModule.midType}`;
    newWin.location.href = targetUrl;
    return status;
  },
  // 下载配置
  async [DOWNLOAD_CONFIG]({ state, getters }) {
    const newWin = window.open('', '_parent');
    const deviceKey = state.devModule.deviceKey;
    let status = true;
    // 前端先检验：如果权限不足，则不请求接口
    if (state.userModule.user.identity <= 2) {
      const res = await https.fetchPost('/userDevice/done', {
        admin: state.userModule.admin,
        deviceKey,
        funcImport: getters.funcImport,
        moreOption: JSON.stringify(state.devModule.moreOption)
      });
      status = res.status === 200;
    }

    const eleToken = localStorage.getItem('eleToken');
    let token = '';
    eleToken && (token = eleToken.split('Bearer ')[1]);
    newWin.location.href = `${process.env.VUE_APP_SERVE_URL}:3000/userDevice/download?deviceKey=${deviceKey}&token=${token}`;
    return status;
  },
  //
  async [DEV_ADD_MIDTYPE]({ state, commit }, { midType, addMidType }) {
    if (!addMidType) return;
    const res = await https.fetchPost('/userDevice/midType/add', {
      midType,
      addMidType,
      id: state.devModule.deviceKey,
      admin: state.userModule.admin
    });
    const status = res.status === 200;
    status && window.myvm.$toast.info('添加细分码成功') && commit(SET_DEV_MODULE, { userDeviceList: res.data, midType: addMidType });
    return status;
  }
};
