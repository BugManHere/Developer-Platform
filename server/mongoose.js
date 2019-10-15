let mongoose = require('mongoose');
/**
 * 连接
 */
mongoose.connect('mongodb://127.0.0.1:27017/GreeIot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection succuss');
});

/**
 * 连接异常
 */
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

module.exports = mongoose;