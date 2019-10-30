const mongoose = require("mongoose");

// 创建Schema
const VerifySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  login: {
    code: String,
    time: String
  },
  register: {
    code: String,
    time: String
  },
});

module.exports = verify = mongoose.model("verify", VerifySchema);
