const express = require('express');
const router = express.Router();
const templateFuncModel = require("../models/template");

require('../mongoose.js');

router.get('/', function(req, res, next) {
  templateFuncModel.find().then((params) => {
    res.json(params);
  })
});

router.post('/create', async function(req, res, next) {
   const params = await templateFuncModel.findOne({deviceKey: req.body.deviceKey});
  if (params) {
    res.json('ok');
  } else {
    const newTemplate = new templateFuncModel({
       productKey: req.body.productKey,
       deviceKey: req.body.deviceKey,
      });
    const saveRes = await newTemplate.save();
    res.status(201).json(saveRes);
  }
});

module.exports = router;
