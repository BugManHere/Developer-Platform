const mongoose = require("mongoose");

// 创建Schema
const deviceSchema = new mongoose.Schema({
  admin: String,
  hasDeviceList: [{
    productID: Number,
    deviceID: Number,
    brand: String,
    deviceName: String,
    productModel: String,
    protocol: String,
    createTime: String,
  }],
});

module.exports = mongoose.model("device", deviceSchema);