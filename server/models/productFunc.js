const mongoose = require("mongoose");

// 创建子Schema
const funcDefineSchema = new mongoose.Schema({
  name: String,
  identifier: String,
  json: String,
  order: [String],
  type: String,
  statusDefine: Object,
  page: Object
});

// 创建Schema
const productFuncSchema = new mongoose.Schema({
  productFunc: [[funcDefineSchema]],
});

module.exports = mongoose.model("function", productFuncSchema);