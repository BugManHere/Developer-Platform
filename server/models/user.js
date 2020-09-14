const mongoose = require('mongoose');

// 创建Schema
const UserSchema = new mongoose.Schema({
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
  }
});

module.exports = mongoose.model('users', UserSchema);
