const mongoose = require("mongoose");

// 创建子Schema
const infoSchema = new mongoose.Schema({
  name: String,
  img: String
});

// 创建Schema
const productTypeSchema = new mongoose.Schema({
  name: String,
  deviceTypeList: [infoSchema],
  plugin: String
});

module.exports = mongoose.model("product-type", productTypeSchema);