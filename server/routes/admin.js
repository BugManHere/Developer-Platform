var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var mongoose = require('../mongoose.js');

let Schema = new mongoose.Schema({
  hasDeviceList: {},
});
let model = mongoose.model('admin', Schema);
let data;

model.find().then((params) => {
  data = params;
})

router.get('/', function(req, res, next) {
  res.json(data[0]);
});

/* GET home page. */
router.post('/', function(req, res, next) {
  res.json(data[0]);
  let Signture  = crypto.createHmac('sha1', global.key);
  Signture.update(req.body.admin);
  const Ciphertext = Signture.digest().toString('base64');
  console.log(Ciphertext);
});

module.exports = router;
