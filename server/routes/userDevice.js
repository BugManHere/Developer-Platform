const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
// 登录token
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
// 权限判断
const permit = require('../api/permit');
import { getOutput, getAdminDevice } from '../api/index';

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

router.get('/', async function(req, res) {
  const admin = req.query.admin;
  const userDevice = await getAdminDevice(admin);
  res.json(userDevice.userDeviceList);
});

router.post('/', async function(req, res) {
  const admin = req.body.admin;
  const userDevice = await getAdminDevice(admin);
  res.json(userDevice.userDeviceList);
});

router.post('/create', async function(req, res) {
  if (!(await permit(res, req.body.admin, 2))) {
    res.status(401).send('没有此权限');
    return;
  }
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

  userDeviceList.push(deviceInfo);
  await userDevice.save();
  res.json(userDeviceList);
});

router.post('/inheritDevice', async function(req, res) {
  if (!(await permit(res, req.body.admin, 2))) {
    res.status(401).send('没有此权限');
    return;
  }
  const { admin } = req.body;
  const { id, productModel, deviceName } = req.body;
  const userDevice = await getAdminDevice(admin);
  const userDeviceList = userDevice.userDeviceList;
  const device = await userDeviceList.id(id);

  const deviceInfo = JSON.parse(JSON.stringify(device));
  deviceInfo._id = new mongoose.Types.ObjectId();
  deviceInfo.productModel = productModel;
  deviceInfo.deviceName = deviceName;
  deviceInfo.createTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  deviceInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  userDeviceList.push(deviceInfo);
  await userDevice.save();
  res.json(userDeviceList);
});

router.post('/delDevice', async function(req, res) {
  if (!(await permit(res, req.body.admin, 2))) {
    res.status(401).send('没有此权限');
    return;
  }
  const admin = req.body.admin;
  const id = req.body.id;
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.userDeviceList.id(id);
  await device.remove();
  await userDevice.save();
  res.json(userDevice.userDeviceList);
});

router.post('/save', async function(req, res) {
  if (!(await permit(res, req.body.admin, 2))) {
    res.status(401).send('没有此权限');
    return;
  }
  const admin = req.body.admin;
  const id = req.body.id;
  const idList = JSON.parse(req.body.idList);
  const userDevice = await getAdminDevice(admin);
  const device = await userDevice.userDeviceList.id(id);
  device.funcImport = idList;
  device.funcImport = Array(...new Set(device.funcImport));
  await userDevice.save();
  res.json(userDevice.userDeviceList);
});

router.post('/delFunc', async function(req, res) {
  if (!(await permit(res, req.body.admin, 2))) {
    res.status(401).send('没有此权限');
    return;
  }
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

router.post('/done', async function(req, res) {
  if (!(await permit(res, req.body.admin, 2))) {
    res.status(200).send('只有预览权限');
    return;
  }

  const deviceInfo = await saveMoreOption(req.body); // 保存更多配置

  const { output, deviceKey, modelPath } = await getOutput(req.body, deviceInfo); // 获取输出/设备id/模板目录地址

  // 写入文件
  fs.writeFileSync(resolve(`../../output/${deviceKey}.json`), JSON.stringify(output));
  fs.writeFileSync(resolve(`../../plugin-mould/${modelPath}/plugin.id.json`), JSON.stringify({ key: deviceKey }));
  res.json(modelPath);
});

router.get('/download', function(req, res) {
  const deviceKey = req.query.deviceKey;
  const downloadUrl = resolve(`../../output/${deviceKey}.json`);
  res.download(downloadUrl);
});

// 保存更多配置
async function saveMoreOption(input) {
  const { admin, deviceKey } = input; // 用户,设备key
  const moreOption = JSON.parse(input.moreOption); // 更多配置项
  const userDevice = await getAdminDevice(admin); // 获取用户下的设备信息
  const device = await userDevice.userDeviceList.id(deviceKey); // 找到对应的设备
  device.moreOption = moreOption; // 将更多配置项存入设备配置中
  userDevice.save(); // 保存
  return device;
}

module.exports = router;
