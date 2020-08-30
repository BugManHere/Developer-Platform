const User = require('../models/user');

// 权限判断
module.exports = (res, admin, root) => {
  return new Promise(resolve => {
    User.findOne({ email: admin }).then(r => {
      resolve(Boolean(r && r.identity <= root));
    });
  });
};
