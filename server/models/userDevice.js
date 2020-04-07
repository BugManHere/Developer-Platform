const mongoose = require("mongoose");

// 创建孙子文档 
const excludeSchema = new mongoose.Schema({
  json: String
})

// 创建孙子文档 
const hideSchema = new mongoose.Schema({
  json: String
})

// 创建子文档 hasDeviceList
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
  excludeMap: excludeSchema,
  hideMap: hideSchema,
  funcImport: [String],
})

// 创建Schema
const userDeviceSchema = new mongoose.Schema({
  admin: String,
  hasDeviceList: [listSchema],
});

module.exports = mongoose.model("user-device", userDeviceSchema);