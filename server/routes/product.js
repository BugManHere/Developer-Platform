var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var mongoose = require('../mongoose.js');

let Schema = new mongoose.Schema({
  productList: [{ name: 'string' }],
});
let model = mongoose.model('product', Schema);
let data;

model.find().then((params) => {
  data = params;
})

router.get('/', function(req, res, next) {
  res.json(data[0]);
});

router.post('/', function(req, res, next) {
  res.json(data[0]);
  let Signture  = crypto.createHmac('sha1', global.key);
  Signture.update(req.body.deviceName);
  console.log(Signture.digest().toString('base64'));
});

module.exports = router;
