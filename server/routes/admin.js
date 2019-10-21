var express = require('express');
var router = express.Router();
var crypto = require('crypto');

let data;

// global.adminModel.find().then((params) => {
//   data = params;
// })

router.get('/', function(req, res, next) {
  global.adminModel.find().then((params) => {
    data = params;
    res.json(data[0]);
  })
});

router.post('/device', function(req, res, next) {
  console.log(global.adminInfo);
});

router.post('/', function(req, res, next) {
  let Signture  = crypto.createHmac('sha1', global.key);
  Signture.update(req.body.admin);
  const Ciphertext = Signture.digest().toString('base64');
  global.admin = Ciphertext;
  global.adminModel.findOne({admin: global.admin}).then((params) => {
    data = params;
    res.json(data);
    global.adminInfo = data;
  })
});

module.exports = router;
