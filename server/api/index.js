import { deepCopy } from '../../utils';

// 获取输出对象
const templateFuncModel = require('../models/template');
const keys = require('../config/keys');
const crypto = require('crypto');
const userDeviceModel = require('../models/userDevice');

// 获取用户下的设备信息
export const getAdminDevice = async admin => {
  let Signture = crypto.createHmac('sha1', keys.secretOrKey);
  Signture.update(admin);
  const Ciphertext = Signture.digest().toString('base64');
  const res = await userDeviceModel.findOne({ admin: Ciphertext });
  return res || { userDeviceList: [] };
};

export const getOutput = async (input, device = undefined) => {
  const { admin, deviceKey, id } = input;
  const key = deviceKey || id;

  // 获取设备信息
  let deviceInfo;
  if (device) {
    deviceInfo = device;
  } else {
    const userDevice = await getAdminDevice(admin); // 获取用户下的设备信息
    deviceInfo = await userDevice.userDeviceList.id(key); // 找到对应的设备
  }

  const { productID, seriesID, modelPath } = deviceInfo; // 获取产品id、分类id、模板目录地址
  const template = await templateFuncModel.findOne({ productID, seriesID }); // 寻找对应模板

  const { funcImport, defaultFunc } = handlerMidType(deviceInfo);

  const jsonDefine = template.jsonDefine || {};
  const typeDefine = template.typeDefine || {};

  const midTypeFunc = deviceInfo.midTypeFunc || {};
  midTypeFunc.default = defaultFunc;

  // 根据功能id寻找功能信息
  const funcDefine = funcImport
    .map(key => {
      return template.funcDefine.id(key);
    })
    .filter(v => v);

  // 处理二级页面逻辑
  funcDefine.forEach((Model, index) => {
    if (Model.page) {
      funcDefine[index].page = Model.page.find(item => item.module === modelPath);
    }
  });

  // 输出的对象
  const output = {
    excludeMap: {}, // 排斥逻辑
    hideMap: {}, // 隐藏逻辑
    productModel: deviceInfo.productModel, // mid
    deviceName: deviceInfo.deviceName, // 系列名
    funcDefine, // 功能定义
    jsonDefine, // 字段类型定义
    typeDefine, // 类型定义
    midTypeFunc, // 细分码
    moreOption: deviceInfo.moreOption // 更多配置项
  };

  // 提取逻辑
  const extractLogic = (status, key) => {
    if (status[key] && status[key].length) {
      // 如果存在互斥逻辑
      return status[key]; // 返回互斥
    }
    return [];
  };

  // 遍历功能,提取排斥/隐藏逻辑
  funcDefine.forEach(func => {
    if (!func) return;
    const id = func.identifier; // 获取id
    // 轮询功能里面的状态，提取互斥
    Object.keys(func.statusDefine).forEach(statusKey => {
      // if (statusKey === 'undefined' || !func.statusDefine[statusKey].isCheck) return; // 排除1.'其他'状态；2.不检查互斥的状态
      if (!func.statusDefine[statusKey].isCheck) return; // 排除不检查互斥的状态
      const stateKey = `${id}_${statusKey}`; // 获取状态的key值
      const arr1 = extractLogic(func.statusDefine[statusKey], 'excludeArr'); // 提取互斥
      const arr2 = extractLogic(func.statusDefine[statusKey], 'hideArr'); // 提取互斥
      if (arr1.length) {
        output.excludeMap[stateKey] = arr1; // 记录互斥关系
      } // 如果空，不操作
      if (arr2.length) {
        output.hideMap[stateKey] = arr2; // 记录互斥关系
      } // 如果空，不操作
    });
  });

  return { output, deviceKey: key, modelPath };
};

function handlerMidType(deviceInfo) {
  let { funcImport, midTypeFunc } = deviceInfo;
  const defaultFunc = deepCopy(funcImport);
  if (midTypeFunc) {
    for (const func in midTypeFunc) {
      funcImport.push(...midTypeFunc[func]);
    }
  }
  funcImport = Array(...new Set(funcImport));
  return { funcImport, defaultFunc };
}
