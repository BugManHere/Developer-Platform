const express = require('express');
const router = express.Router();
const productFuncModel = require("../models/productFunc");

require('../mongoose.js');

let data;

router.get('/', function(req, res, next) {
  productFuncModel.find().then((params) => {
    data = params;
    const productID = req.query.productID;
    res.json(data[0].productFunc[productID]);
  })
});

router.post('/update', function(req, res, next) {
});

module.exports = router;
