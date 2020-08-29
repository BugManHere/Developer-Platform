const User = require('../models/user');

// 权限判断
module.exports = (res, admin, root) => {
  return new Promise(resolve => {
    const user = User.findOne({ email: admin });
    if (user && user.identity <= root) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
