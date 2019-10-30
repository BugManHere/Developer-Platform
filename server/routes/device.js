const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const deviceModel = require("../models/device");

let data;

router.get('/', function(req, res, next) {
  deviceModel.find().then((params) => {
    data = params;
    res.json(data[0]);
  })
});

router.post('/info', function(req, res, next) {
  deviceModel.findOne({admin: global.admin}).then((params) => {
    res.json(params.hasDeviceList[req.body.productKey]);
  })
});

router.post('/', function(req, res, next) {
  let Signture  = crypto.createHmac('sha1', global.key);
  Signture.update(req.body.admin);
  const Ciphertext = Signture.digest().toString('base64');
  global.admin = Ciphertext;
  deviceModel.findOne({admin: global.admin}).then((params) => {
    data = params;
    res.json(data);
    global.adminInfo = data;
  })
});

module.exports = router;
