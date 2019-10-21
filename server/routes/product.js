var express = require('express');
var router = express.Router();
var dayjs = require('dayjs');

require('../mongoose.js');

let data;

// global.productModel.find().then((params) => {
//   data = params;
// })

router.get('/', function(req, res, next) {
  global.productModel.find().then((params) => {
    data = params;
    res.json(data[0]);
  })
});

router.post('/', function(req, res, next) {
  const map = {};
  map.productID = req.body.productID;
  map.deviceID = req.body.deviceID;
  map.brand = req.body.brand;
  map.deviceName = req.body.deviceName;
  map.productModel = req.body.productModel;
  map.protocol = req.body.protocol;
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
