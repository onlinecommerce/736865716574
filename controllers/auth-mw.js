const User = require("./../models/user-m");

exports.restrictTo = (...roles) =>
  async (req, res, next) => {
    roles = roles[0];
    let user
    try {
      user = await User.findOne({
        _id: req.query.id
      });
    } catch (err) {
      return res.status(401).json({
        status: 'fail',
        message: 'User[name] doesn\'t exist'
      })
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        status: 'unauthorized',
        message: "you are not authorized to do this"
      })
    }
    next()
  }