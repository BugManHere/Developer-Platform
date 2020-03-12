const mongoose = require("mongoose");

// 创建孙子文档 
const excludeSchema = new mongoose.Schema({
  json: String
})

// 创建孙子文档 
const hideSchema = new mongoose.Schema({
  json: String
})

// 创建孙子文档 funcDefine
const funcSchema = new mongoose.Schema({
  name: String,
  identifier: String,
  json: String,
  order: [String],
  type: String,
  statusDefine: Object,
  page: Object
})

// 创建子文档 hasDeviceList
const listSchema = new mongoose.Schema({
  productID: Number,
  productName: String,
  deviceID: Number,
  brand: String,
  deviceName: String,
  productModel: String,
  protocol: String,
  createTime: String,
  imgPath: String,
  excludeMap: excludeSchema,
  hideMap: hideSchema,
  funcDefine: [funcSchema],
})

// 创建Schema
const deviceSchema = new mongoose.Schema({
  admin: String,
  hasDeviceList: [listSchema],
});

module.exports = mongoose.model("device", deviceSchema);