const mongoose = require("mongoose");

// 创建孙子文档 
const logicSchema = new mongoose.Schema({
  json: String
})

// 创建孙子文档 
const disableSchema = new mongoose.Schema({
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
})

// 创建子文档 hasDeviceList
const listSchema = new mongoose.Schema({
  productID: Number,
  deviceID: Number,
  brand: String,
  deviceName: String,
  productModel: String,
  protocol: String,
  createTime: String,
  logicMap: logicSchema,
  disableMap: disableSchema,
  funcDefine: [funcSchema],
})

// 创建Schema
const deviceSchema = new mongoose.Schema({
  admin: String,
  hasDeviceList: [listSchema],
});

module.exports = mongoose.model("device", deviceSchema);