const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  // service: 'QQ', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  // port: 8080, // SMTP 端口
  // secureConnection: true, // 使用了 SSL
  auth: {
    user: '1260011042@qq.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'edwplpszfropicjf',
  }
});

function VerificationCode() {
  let Num = '';
  for (let i = 0; i< 6; i += 1) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}

//发送邮件
module.exports = function (mail){
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: '1260011042@qq.com', // sender address
      to: mail, // list of receivers
      subject: '你正在注册GDP账号', // Subject line
      // 发送text或者html格式
      text: '验证码' + VerificationCode(), // plain text body
    }, function(error, info){
        if(error) {
          reject(error);
        }
        console.log('mail sent:', info.response);
        resolve('ok');
    });
  })
};
