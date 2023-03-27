const Rating = require("./../models/rating-m");
const User = require("./../models/user-m");
const catchAsync = require("./../utils/catchAsync");

exports.getRating = catchAsync(async (req, res, next) => {
  let id = req.query.id;
  let userId = req.query.userId;
  let rating = await Rating.findOne({
    raterId: id,
    userId
  }).populate("raterId userId")

  res.status(200).json({
    status: 'success',
    rating
  })
});

exports.createRating = catchAsync(async (req, res, next) => {
  let raterId = req.query.id;
  let rate = Number.parseInt(req.query.rate)
  let data = {
    userId: req.query.userId,
    rating: rate,
    raterId
  };

  let rating = await Rating.findOne({
    userId: data.userId,
    raterId
  });
  if (rating) {
    rating = await Rating.updateOne({
      userId: data.userId,
      raterId
    }, {
      $set: {
        rating: data.rating
      }
    });
  } else {
    rating = await Rating.create(data);
  }

  let ratings = await Rating.find({
    userId: data.userId
  })
  let sum = ratings.reduce((total, val) => total + val.rating, 0);
  ratings = sum / ratings.length;
  ratings = ratings.toFixed(1);


  let user = await User.updateOne({
    _id: data.userId
  }, {
    $set: {
      rating: ratings
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      rating,
      user
    }
  })
})
