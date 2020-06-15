const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const templateFuncModel = require('../models/template');

require('../mongoose.js');

router.get('/', function(req, res) {
  templateFuncModel.find().then(params => {
    res.json(params);
  });
});

// 创建模板
router.post('/create', async function(req, res) {
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
  const productInfo = await getProductInfo(req.body.tempID);
  const funcDefine = JSON.parse(req.body.funcDefine);
  productInfo.funcDefine = funcDefine;
  productInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  res.json(await productInfo.save());
});

// 模板编辑功能
router.post('/editFunc', async function(req, res) {
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
  const productInfo = await getProductInfo(req.body.tempID);
  const insetMap = JSON.parse(req.body.insertMap);
  productInfo.funcDefine.push(insetMap); // 插入新功能
  productInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  res.json(await productInfo.save());
});

// 模板删除功能
router.post('/delFunc', async function(req, res) {
  const productInfo = await getProductInfo(req.body.tempID);
  const suvbFuncDefine = productInfo.funcDefine[req.body.index];
  suvbFuncDefine.remove();
  productInfo.editTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  res.json(await productInfo.save());
});

// 模板配置完毕
router.post('/done', async function(req, res) {
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
