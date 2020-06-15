const mongoose = require("mongoose");

// 创建子文档 funcDefine
const funcSchema = new mongoose.Schema({
  name: String,
  identifier: String,
  json: String,
  order: [String],
  map: Object,
  type: String,
  statusDefine: Object,
  page: Object
})

// 创建Schema
const templateSchema = new mongoose.Schema({
  productID: String,
  seriesID: String,
  createTime: String,
  editUser: String,
  editTime: String,
  useTime: Number,
  funcDefine: [funcSchema]
});

module.exports = mongoose.model("template", templateSchema);