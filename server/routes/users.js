// 登录和注册
const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Verify = require("../models/verify");
// 密码加密
const bcrypt = require("bcrypt");
// 登录token
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require("passport");
// 邮箱验证
const mail = require('../api/mail');
// 日期模块
const dayjs = require('dayjs');

// post请求：注册接口 users/register
router.post("/register", (req, res) => {
  console.log('yes');
  //查询数据库是否有邮箱
  User.findOne({
      email: req.body.email
    })
    .then((user) => {
      if (user) {
        return res.status(400).json("邮箱已被注册");
      } else {
        console.log('yes');
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          identity: req.body.identity
        });
        // 加密
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// post请求：登录接口 users/login
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //查询数据库是否有邮箱
  console.log(email);
  User.findOne({
      email
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json("用户不存在！");
      } else {
        //密码匹配
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              // 登录规则
              const rule = {
                id: user.id,
                name: user.name,
                email: user.email,
                identity: user.identity
              }
              jwt.sign(rule, keys.secretOrKey, {
                expiresIn: 60 * 60 * 24
              }, (err, token) => {
                if (err) throw err;
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              });
              //   res.json({msg : "success"});
            } else {
              return res.status(400).json("密码错误");
            }
          });
      }
    });
});

// post请求：登录接口 users/login
router.post("/mail", (req, res) => {
  const email = req.body.email;
  console.log(email);
  //查询数据库是否有邮箱
  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(202).json("邮箱已被注册");
      } else {
        Verify.findOne({ email })
          .then((verify) => {
            console.log(verify);
            if (verify && verify.register) {
              const currentDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
              const lastDate = verify.register.time;
            } else {
              mail(email)
                .then((data) => {
                  const newVerify = new Verify({
                    email: email,
                  });
                  newVerify.save().then(() => {
                    console.log('yes');
                    res.json(data);
                  })
                  .catch((err) => {
                    console.log(err);
                  })
                })
            }
          })
      }
    });
});

module.exports = router;