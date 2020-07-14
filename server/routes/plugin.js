const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const userDeviceModel = require('../models/userDevice');
const templateFuncModel = require("../models/template");
// 登录token
const keys = require('../config/keys');

router.get('/config', async function(req, res, next) {
  const admin = req.query.admin;
  const id = req.query.id;
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.userDeviceList.id(id);

  const productID = device.productID;
  const seriesID = device.seriesID;
  const template = await templateFuncModel.findOne({productID, seriesID}); // 寻找对应模板
  
  const funcDefine = device.funcImport.map(key => {
    return template.funcDefine.id(key);
  })

  const output = {
    excludeMap: {},
    hideMap: {},
    productModel: device.productModel,
    deviceName: device.deviceName,
    funcDefine,
    moreOption: device.moreOption
  };
  const extractLogic = (status, key) => {
    if (status[key] && status[key].length) { // 如果存在互斥逻辑
     return status[key]; // 返回互斥
    }
    return [];
  };
  funcDefine.forEach(func => {
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

  res.json(output);
});

async function getAdminDevice(admin) {
  let Signture = crypto.createHmac('sha1', keys.secretOrKey);
  Signture.update(admin);
  const Ciphertext = Signture.digest().toString('base64');
  const res = await userDeviceModel.findOne({ admin: Ciphertext });
  console.log(Ciphertext);
  return res || {userDeviceList: []};
}

module.exports = router;
