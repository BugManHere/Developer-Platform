const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 创建Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },

  identity: {
    type: Number,
    required: true
  },
});

module.exports = user = mongoose.model("users", UserSchema);
