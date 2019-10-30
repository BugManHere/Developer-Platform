// var express = require('express');
// var router = express.Router();
// var crypto = require('crypto');

// let Signture  = crypto.createHmac('sha1', 'greekey');

// global.productModel.find().then((params) => {
//   global.productList = params[0];
// })

// router.get('/', function(req, res, next) {
//   switch(req.query.action) {
//     case 'getProductList':
//       res.json(global.productList);
//     break;
//     default:
//     break;
//   }
// });

// router.post('/', function(req, res, next) {
//   switch(req.body.action) {
//     case 'postAdmin':
//       if (!global.admin) {
//         Signture.update(req.body.admin);
//         global.admin = Signture.digest().toString('base64');
//       }
//       global.adminModel.findOne({admin: global.admin}).then((params) => {
//         res.json(params);
//         global.adminInfo = params;
//       })
//     break;
//     default:
//     break;
//   }
// });

// module.exports = router;
