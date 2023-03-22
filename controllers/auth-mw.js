const User = require("./../models/user-m");

exports.restrictTo = (...roles) =>
  async (req, res, next) => {
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
      return next(
        new AppError("You do not have permission to do this action", 403)
      );
    }
    next()
  }