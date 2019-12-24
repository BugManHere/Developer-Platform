const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const deviceModel = require("../models/device");
const fs = require('fs');
const path = require('path');

const resolve = dir => {
  return path.join(__dirname, dir);
};

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
  deviceModel.findOne({admin: global.admin}).then((data) => {
    res.json(data);
    global.adminInfo = data;
  })
});

router.post('/save', function(req, res, next) {
  const body = global.adminInfo.hasDeviceList.id(req.body.key);
  const funcDefine = JSON.parse(req.body.funcDefine);
  const logicMap = req.body.logicMap;
  body.funcDefine = funcDefine;
  body.logicMap.json = logicMap;
  global.adminInfo.save()
    .then(v => {
      res.json(v);
    })
    .catch(err => {
      res.json(err);
    })
});

router.post('/editFunc', function(req, res, next) {
  const index = req.body.index;
  const body = global.adminInfo.hasDeviceList.id(req.body.key);
  const funcDefine = JSON.parse(req.body.funcDefine);
  body.funcDefine[index] = funcDefine[index];
  global.adminInfo.save()
    .then(v => {
      res.json(v);
    })
    .catch(err => {
      res.json(err);
    })
})

router.post('/pushFunc', function(req, res, next) {
  const body = global.adminInfo.hasDeviceList.id(req.body.key);
  const insetMap = JSON.parse(req.body.insertMap);
  body.funcDefine.push(insetMap);
  global.adminInfo.save()
    .then(v => {
      res.json(v);
    })
    .catch(err => {
      res.json(err);
    })
})

router.post('/delFunc', function(req, res, next) {
  let body = global.adminInfo.hasDeviceList.id(req.body.key);
  const funcDefine = body.funcDefine[req.body.index];
  const identifier = funcDefine.identifier;
  const json = body.logicMap.json.replace(new RegExp("\"" + identifier + "\"",'g'), "\"\"");
  body.logicMap.json = json;
  funcDefine.remove();
  global.adminInfo.save()
    .then(v => {
      res.json(v);
    })
    .catch(err => {
      res.json(err);
    })
});

router.post('/done', function(req, res, next) {
  const key = req.body.key;
  const body = global.adminInfo.hasDeviceList.id(key);
  const funcDefine = JSON.parse(req.body.funcDefine);
  const logicMap = req.body.logicMap;
  body.funcDefine = funcDefine;
  body.logicMap.json = logicMap;
  global.adminInfo.save((err, product) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(resolve(`../../output/${key}.json`), JSON.stringify(body), err => {
        if (err) throw err;
        fs.writeFile(resolve('../../plugin-mould/vue-cli3-model/plugin.id.json'), JSON.stringify({key}), err => {
          if (err) throw err;
          res.json(product);
        });
      });
    }
  });
});
module.exports = router;