const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const productTypeModel = require('../models/productType');
const userDeviceModel = require('../models/userDevice');
const templateFuncModel = require("../models/template");
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
// 登录token
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
// 权限判断
const permit = require("../api/permit");

const resolve = dir => {
  return path.join(__dirname, dir);
};

router.use(function(req, res, next) {
  // 拿取token 数据 按照自己传递方式写
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {      
      // 解码 token (验证 secret 和检查有效期（exp）)
      jwt.verify(token, keys.secretOrKey, function(err, decoded) {      
            if (err) {
              return res.status(403).send('用户信息过期');
            } else {
              // 如果验证通过，在req中写入解密结果
              req.decoded = decoded;  
              next(); //继续下一步路由
        }
      });
  } else {
    // 没有拿到token 返回错误 
    return res.status(403).send('用户信息过期');
  }
});

router.get('/', async function(req, res, next) {
  const admin = req.body.admin;
  const userDevice = await getAdminDevice(admin);
  res.json(userDevice.userDeviceList);
});

router.post('/', async function(req, res, next) {
  const admin = req.body.admin;
  const userDevice = await getAdminDevice(admin);
  res.json(userDevice.userDeviceList);
});

router.post('/create', async function(req, res, next) {
  const hasPermit = await permit(res, req.body.admin, 2);
  if (!hasPermit) return;
  const admin = req.body.admin;
  const userDevice = await getAdminDevice(admin);
  const userDeviceList = userDevice.userDeviceList;

  const deviceInfo = JSON.parse(req.body.deviceInfo);
  deviceInfo.createTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  deviceInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  deviceInfo.moreOption = {
    voiceSkill: false,
    temUnChange: false,
    temStep: '0.5',
    fanRange: '7',
    statueJson: [],
    statueJson2: []
  };
  // 默认功能
  deviceInfo.productName === '立柜式空调' && (deviceInfo.funcImport = [
    "5e54a3abbf4af11b3c07b747",
    "5e660a3de2e36024789d8718",
    "5e54a3abbf4af11b3c07b746",
    "5e5771a1aad6f324b4089969",
    "5e5771a1aad6f324b4089968",
    "5e5771a1aad6f324b4089967",
    "5e5771a1aad6f324b4089966",
    "5e66093ee2e36024789d8653",
    "5e53827abf4af11b3c07b5ca",
    "5e53827abf4af11b3c07b5c9",
    "5e53827abf4af11b3c07b5c8",
    "5e53827abf4af11b3c07b5c7",
    "5e53827abf4af11b3c07b5c6",
    "5e53827abf4af11b3c07b5c5",
    "5e53827abf4af11b3c07b5c4",
    "5e53827abf4af11b3c07b5c3"
  ]);

  userDeviceList.push(deviceInfo);
  await userDevice.save();
  res.json(userDeviceList);
});

router.post('/delDevice', async function(req, res, next) {
  const hasPermit = await permit(res, req.body.admin, 2);
  if (!hasPermit) return;
  const admin = req.body.admin;
  const id = req.body.id;
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.userDeviceList.id(id);
  await device.remove();
  await userDevice.save();
  res.json(userDevice.userDeviceList);
});

router.post('/save', async function(req, res, next) {
  const hasPermit = await permit(res, req.body.admin, 2);
  if (!hasPermit) return;
  const admin = req.body.admin;
  const id = req.body.id;
  const idList = JSON.parse(req.body.idList);
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.userDeviceList.id(id);
  device.funcImport = idList;
  device.funcImport = Array(...new Set(device.funcImport))
  await userDevice.save();
  res.json(userDevice.userDeviceList);
});

router.post('/delFunc', async function(req, res, next) {
  const hasPermit = await permit(res, req.body.admin, 2);
  if (!hasPermit) return;
  const admin = req.body.admin;
  const id = req.body.id;
  const funcId = req.body.funcId;
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.userDeviceList.id(id);
  const funcImport = device.funcImport;
  const delIndex = funcImport.findIndex(item => item === funcId);
  funcImport.splice(delIndex, 1);
  await userDevice.save();
  res.json(userDevice.userDeviceList);
});

router.post('/done', async function(req, res, next) {
  const hasPermit = await permit(res, req.body.admin, 2);
  if (!hasPermit) return;
  const admin = req.body.admin;
  const id = req.body.id;
  const moreOption = JSON.parse(req.body.moreOption);
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.userDeviceList.id(id);

  const productID = device.productID;
  const seriesID = device.seriesID;
  const template = await templateFuncModel.findOne({productID, seriesID}); // 寻找对应模板
  const { plugin } = await productTypeModel.findById(productID); // 模板地址
  
  const funcDefine = device.funcImport.map(key => {
    return template.funcDefine.id(key);
  })

  device.moreOption = moreOption;
  userDevice.save();

  const output = {
    excludeMap: {},
    hideMap: {},
    productModel: device.productModel,
    deviceName: device.deviceName,
    funcDefine,
    moreOption
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

  // 写入文件
  fs.writeFile(resolve(`../../output/${id}.json`), JSON.stringify(output), err => {
    if (err) throw err;
    fs.writeFile(resolve(`../../plugin-mould/${plugin}/plugin.id.json`), JSON.stringify({key: id}), err => {
      if (err) throw err;
    });
  });

  res.json(device);
});

async function getAdminDevice(admin) {
  let Signture = crypto.createHmac('sha1', keys.secretOrKey);
  Signture.update(admin);
  const Ciphertext = Signture.digest().toString('base64');
  const res = await userDeviceModel.findOne({ admin: Ciphertext });
  return res || {userDeviceList: []};
}

module.exports = router;
