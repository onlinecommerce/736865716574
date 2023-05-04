const User = require("./../models/user-m");
const Item = require("./../models/item-m");

exports.restrictTo = (roles) =>
  async (req, res, next) => {
    roles = [].concat(...roles);
    let user;
    try {
      user = await User.findOne({
        _id: req.query.id
      });
      if (!user) return res.status(403).json({
        status: 'unauthorized',
        message: "you are not authorized to do this"
      })
    } catch (err) {
      return res.status(401).json({
        status: 'fail',
        message: 'User[name] doesn\'t exist'
      })
    }
    if (user && !roles.includes(user.role)) {
      return res.status(403).json({
        status: 'unauthorized',
        message: "you are not authorized to do this"
      })
    }
    next()
  }


function getDates() {
  const fullDayInMilliSeconds = 1000 * 60 * 60 * 24;
  let yesterday, tomorrow;
  let now = new Date();
  let day = now.getDate(),
    month = now.getMonth(),
    year = now.getFullYear();
  now = new Date(`${month+1}-${day-2}-${year}`);

  yesterday = new Date(Date.parse(now) - fullDayInMilliSeconds);
  tomorrow = new Date(Date.parse(now) + fullDayInMilliSeconds * 3);
  return [yesterday, now, tomorrow];
}


exports.limitPost = async (req, res, next) => {
  let user = await User.findOne({
    _id: req.query.id
  });
  let n = user._doc.postPerDay;

  let dates = getDates();
  let posts = await Item.find({
    postedBy: req.query.id,
    created_at: {
      $gte: dates[0],
      $lte: dates[2]
    }
  })

  if (n - posts.length || !posts.length) {
    req.query.postPerDay = posts.length + 1;
    next()
  } else {
    return res.status(200).json({
      status: 'over',
      posts: posts.length
    })
  }
}