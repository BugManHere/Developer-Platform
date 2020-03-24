const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const productTypeModel = require("../models/productType");

require('../mongoose.js');

let data;

router.get('/', function(req, res, next) {
  productTypeModel.find().then((params) => {
    data = params;
    res.json(data);
    // const deviceTypeList = data[0].deviceTypeList;
    // deviceTypeList.push({
    //   "name": "壁挂式空调",
    //   "img": "Hangon.png",
    // },
    // {
    //   "name": "立柜式空调",
    //   "img": "Cabinet.png"
    // });
    // console.log(deviceTypeList);
    // data[0].save();
  })
  productTypeModel
});

router.post('/', function(req, res, next) {
  const map = req.body;
  map.logicMap = {json: "{}"};
  map.disableMap = {json: "{}"};
  map.createTime = dayjs().format('YYYY.MM.DD');
  const hasDeviceList = global.adminInfo.hasDeviceList;
  hasDeviceList.push(map);

  global.adminInfo.set({hasDeviceList: hasDeviceList});
  global.adminInfo.save()
    .then((v) => {
      res.json(v);
      console.log(v);
    })
    .catch((err) => {
      console.log(err);
    })
});

module.exports = router;
