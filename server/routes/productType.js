const models = require('../models/index');
const express = require('express');
const router = express.Router();
const productTypeModel = require("../models/productType");
// 登录token
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

let data;

router.use(function (req, res, next) {
  // 拿取token 数据 按照自己传递方式写
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    // 解码 token (验证 secret 和检查有效期（exp）)
    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
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

router.get('/', function (req, res, next) {
  productTypeModel.find().then((params) => {
    data = params;
    res.json(data);
    // const seriesList = data[0].seriesList;
    // seriesList.push({
    //   "name": "商用挂机",
    //   "img": "Hangon.png"
    // });
    // console.log(seriesList);
    // data[0].save();
  })
});

module.exports = router;
