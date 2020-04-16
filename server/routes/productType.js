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
    // const seriesList = data[0].seriesList;
    // seriesList.push({
    //   "name": "壁挂式空调",
    //   "img": "Hangon.png",
    // },
    // {
    //   "name": "立柜式空调",
    //   "img": "Cabinet.png"
    // });
    // console.log(seriesList);
    // data[0].save();
  })
});

router.post('/', function(req, res, next) {
  const map = req.body;
  map.logicMap = {json: "{}"};
  map.disableMap = {json: "{}"};
  map.createTime = dayjs().format('YYYY.MM.DD HH:mm:ss');
  const userDeviceList = global.adminInfo.userDeviceList;
  userDeviceList.push(map);

  global.adminInfo.set({userDeviceList: userDeviceList});
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
