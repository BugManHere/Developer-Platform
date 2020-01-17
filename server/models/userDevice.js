const mongoose = require('mongoose');

// 创建孙子文档
const optionSchema = new mongoose.Schema({
  pluginVer: String,
  voiceSkill: Boolean,
  autoAbleTem: Boolean,
  temStep: String,
  statueJson: [String],
  statueJson2: [String]
});

// 创建子文档 userDeviceList
const listSchema = new mongoose.Schema({
  productID: String,
  productName: String,
  seriesID: String,
  brand: String,
  deviceName: String,
  productModel: String,
  protocol: String,
  createTime: String,
  editTime: String,
  imgPath: String,
  modelPath: String,
  moreOption: optionSchema,
  funcImport: [String],
  midTypeFunc: mongoose.Schema.Types.Mixed
});

// 创建Schema
const userDeviceSchema = new mongoose.Schema({
  admin: String,
  userDeviceList: [listSchema]
});

module.exports = mongoose.model('user-device', userDeviceSchema);
