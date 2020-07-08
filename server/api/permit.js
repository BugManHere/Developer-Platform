const User = require("../models/user");

// 权限判断
module.exports = (res, admin, root) => {
  return new Promise(async resolve => {
    const user = await User.findOne({ email: admin });
    if (user && user.identity <= root) {
      resolve(true);
    } else {
      res.status(401).send('没有此权限');
      resolve(false);
    }
  })
};