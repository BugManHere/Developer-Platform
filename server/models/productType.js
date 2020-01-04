const mongoose = require("mongoose");

// 创建Schema
const productTypeSchema = new mongoose.Schema({
  productTypeList: [{
    name: String,
    deviceTypeList: [
      {
        name: String,
        img: String
      }
    ],
    plugin: String
  }],
});

module.exports = mongoose.model("product-type", productTypeSchema);