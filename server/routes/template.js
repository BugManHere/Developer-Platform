const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const templateFuncModel = require('../models/template');

// 登录token
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
require('../mongoose.js');
// 权限判断
const permit = require("../api/permit");

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

router.get('/', function(req, res) {
  templateFuncModel.find().then(params => {
    res.json(params);
  });
});

// 创建模板
router.post('/create', async function(req, res) {
  if (!await permit(res, req.body.admin, 1)) {
    res.status(401).send('没有此权限');
    return;
  }
  const params = await templateFuncModel.findOne({
    seriesID: req.body.seriesID,
    productID: req.body.productID
  });
  if (params) {
    res.json('ok');
  } else {
    const newTemplate = new templateFuncModel({
      productID: req.body.productID,
      seriesID: req.body.seriesID,
      createTime: dayjs().format('YYYY.MM.DD HH:mm:ss'),
      editUser: '陈文中',
      editTime: dayjs().format('YYYY.MM.DD HH:mm:ss'),
      useTime: 0
    });
    await newTemplate.save();
    res.status(201).json(await templateFuncModel.find());
  }
});

// 模板保存功能
router.post('/save', async function(req, res) {
  if (!await permit(res, req.body.admin, 1)) {
    res.status(401).send('没有此权限');
    return;
  }
  const productInfo = await getProductInfo(req.body.tempID);
  const funcDefine = JSON.parse(req.body.funcDefine);
  funcDefine.forEach(funcItem => {
    const map = {
      default: String(funcItem.order[0]),
      undefined: 'default'
    };
    console.log(funcItem.order);
    funcItem.order.forEach((statusName, index) => {
      map[statusName] = funcItem.order[index + 1] || 'default';
    });
    Object.keys(funcItem.statusDefine).forEach(statusName => {
      map[statusName] || (map[statusName] =  'default');
    });
    funcItem.map = map;
  });
  productInfo.funcDefine = funcDefine;
  productInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  res.json(await productInfo.save());
});

// 模板编辑功能
router.post('/editFunc', async function(req, res) {
  if (!await permit(res, req.body.admin, 1)) {
    res.status(401).send('没有此权限');
    return;
  }
  const productInfo = await getProductInfo(req.body.tempID);
  const subFuncDefine = JSON.parse(req.body.subFuncDefine);
  const subFuncDefineCopy = productInfo.funcDefine.id(subFuncDefine._id);
  // 赋值
  subFuncDefineCopy.order = subFuncDefine.order;
  subFuncDefineCopy.name = subFuncDefine.name;
  subFuncDefineCopy.identifier = subFuncDefine.identifier;
  subFuncDefineCopy.json = subFuncDefine.json;
  subFuncDefineCopy.type = subFuncDefine.type;
  subFuncDefineCopy.page = subFuncDefine.page;
  subFuncDefineCopy.statusDefine = subFuncDefine.statusDefine;
  productInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  res.json(await productInfo.save());
});

// 模板添加新功能
router.post('/addFunc', async function(req, res) {
  if (!await permit(res, req.body.admin, 1)) {
    res.status(401).send('没有此权限');
    return;
  }
  const productInfo = await getProductInfo(req.body.tempID);
  const insetMap = JSON.parse(req.body.insertMap);
  productInfo.funcDefine.push(insetMap); // 插入新功能
  productInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  res.json(await productInfo.save());
});

// 模板删除功能
router.post('/delFunc', async function(req, res) {
  if (!await permit(res, req.body.admin, 1)) {
    res.status(401).send('没有此权限');
    return;
  }
  const productInfo = await getProductInfo(req.body.tempID);
  const suvbFuncDefine = productInfo.funcDefine[req.body.index];
  suvbFuncDefine.remove();
  productInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  res.json(await productInfo.save());
});

// 模板配置完毕
router.post('/done', async function(req, res) {
  if (!await permit(res, req.body.admin, 1)) {
    res.status(401).send('没有此权限');
    return;
  }
  const productInfo = await getProductInfo(req.body.tempID);
  const funcDefine = JSON.parse(req.body.funcDefine);
  productInfo.funcDefine = funcDefine;
  productInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  res.json(await productInfo.save());
});

async function getProductInfo(tempID) {
  const productID = tempID.split('&')[0];
  const seriesID = tempID.split('&')[1];
  return await templateFuncModel.findOne({ productID, seriesID }); // 寻找对应模板
}

module.exports = router;
