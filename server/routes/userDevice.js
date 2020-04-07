const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const userDeviceModel = require('../models/userDevice');
const templateFuncModel = require("../models/template");
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

const resolve = dir => {
  return path.join(__dirname, dir);
};

let data;

router.get('/', async function(req, res, next) {
  const admin = req.body.admin;
  const userDevice = await getAdminDevice(admin);
  res.json(userDevice.hasDeviceList);
});

router.post('/', async function(req, res, next) {
  const admin = req.body.admin;
  const userDevice = await getAdminDevice(admin);
  res.json(userDevice.hasDeviceList);
});

router.post('/create', async function(req, res, next) {
  const admin = req.body.admin;
  const userDevice = await getAdminDevice(admin);
  const hasDeviceList = userDevice.hasDeviceList;

  const deviceInfo = JSON.parse(req.body.deviceInfo);
  deviceInfo.createTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  deviceInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');

  hasDeviceList.push(deviceInfo);
  await userDevice.save();
  res.json(hasDeviceList);
});

router.post('/delDevice', async function(req, res, next) {
  const admin = req.body.admin;
  const id = req.body.id;
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.hasDeviceList.id(id);
  await device.remove();
  await userDevice.save();
  res.json(userDevice.hasDeviceList);
});

router.post('/save', async function(req, res, next) {
  const admin = req.body.admin;
  const id = req.body.id;
  const idList = JSON.parse(req.body.idList);
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.hasDeviceList.id(id);
  device.funcImport.push(...idList);
  device.funcImport = Array(...new Set(device.funcImport))
  await userDevice.save();
  res.json(userDevice.hasDeviceList);
});

router.post('/addFunc', function(req, res, next) {});

router.post('/delFunc', async function(req, res, next) {
  const admin = req.body.admin;
  const id = req.body.id;
  const funcId = req.body.funcId;
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.hasDeviceList.id(id);
  const funcImport = device.funcImport;
  const delIndex = funcImport.findIndex(item => item === funcId);
  funcImport.splice(delIndex, 1);
  await userDevice.save();
  res.json(userDevice.hasDeviceList);
});

router.post('/done', async function(req, res, next) {
  const admin = req.body.admin;
  const id = req.body.id;
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.hasDeviceList.id(id);

  const productID = device.productID;
  const seriesID = device.seriesID;
  const template = await templateFuncModel.findOne({productID, seriesID}); // 寻找对应模板

  const funcDefine = device.funcImport.map(key => {
    console.log(key);
    return template.funcDefine.id(key);
  })
  const output = {
    excludeMap: [],
    hideMap: [],
    funcDefine
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
      if (statusKey === 'undefined' || !func.statusDefine[statusKey].isCheck) return; // 排除1.'其他'状态；2.不检查互斥的状态
      const stateKey = `${id}_${statusKey}`; // 获取状态的key值
      const arr1 = extractLogic(func.statusDefine[statusKey], 'excludeArr'); // 提取互斥
      const arr2 = extractLogic(func.statusDefine[statusKey], 'hideArr'); // 提取互斥
      if (arr1.length) {
        output.excludeMap[stateKey] = arr1; // 记录互斥关系
      } // 如果空，不操作
      if (arr2.length) {
        output.hideMap[stateKey] = arr1; // 记录互斥关系
      } // 如果空，不操作
    });
  });

  fs.writeFile(resolve(`../../output/${id}.json`), JSON.stringify(output), err => {
    if (err) throw err;
    fs.writeFile(resolve('../../plugin-mould/vue-cli3-model/plugin.id.json'), JSON.stringify({key: id}), err => {
      if (err) throw err;
    });
  });

  res.json(device);
});

async function getAdminDevice(admin) {
  let Signture = crypto.createHmac('sha1', global.key);
  Signture.update(admin);
  const Ciphertext = Signture.digest().toString('base64');
  return await userDeviceModel.findOne({ admin: Ciphertext });
}

module.exports = router;
