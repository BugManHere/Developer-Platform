// var createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport");

// 引入json解析中间件
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const productTypeRouter = require('./routes/productType');
const userDeviceRouter = require('./routes/userDevice');
const templateRouter = require('./routes/template');
const pluginRouter = require('./routes/plugin');

const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 初始化passport
app.use(passport.initialize());
require('./config/passport')(passport);

// 自定义跨域中间件
var allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
app.use(allowCors);//使用跨域中间件

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', indexRouter);
app.use('/productType', productTypeRouter);
app.use('/userDevice', userDeviceRouter);
app.use('/template', templateRouter);
app.use('/plugin', pluginRouter);
app.use('/users', usersRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

// 访问静态资源
app.use(express.static(path.resolve(__dirname, '../public')));

// 监听
app.listen(3000, function () {
  console.log('success listen...3000');
});

app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("Success! You can not see this without a token");
});
