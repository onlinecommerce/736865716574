const ApiFeatures = require("../utils/APIFeatures");
const catchAsync = require("./../utils/catchAsync");
const Category = require("./../models/category-m");
const Item = require("./../models/item-m");

exports.getCategory = catchAsync(async (req, res, next) => {
  let category;
  if (req.query.distinct) {
    // category = await Category.find().distinct("category");
    category = await Item.aggregate([{
      $group: {
        _id: '$category',
        total: {
          $sum: 1
        }
      }
    }])
    // let temp = await Category.countDocuments({category: category[0]});
  } else if (req.query.category && !req.query.subcategory) {
    category = await Item.aggregate([ { $match: { category: req.query.category } }, { $group: { _id: '$subCategory', total: { $sum: 1 } } }])
  } else {
    category = await Category.find().sort({
      order: 1,
    });
  }

  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.posting = catchAsync(async (req, res, next) => {
  let category;
  if (req.query.distinct) {
    category = await Category.find().distinct("category");
  } else {
    category = await Category.findOne({ category: req.query.category });
  }
  res.status(200).json({
    status: 'success',
    data: category
  })
})

exports.saveCategory = catchAsync(async (req, res, next) => {
  let category = await Category.create(req.body);

  category = await Category.find().sort({
    order: 1,
  });

  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.editCategory = catchAsync(async (req, res, next) => {
  let category = await Category.updateOne({
    _id: req.body._id,
  }, {
    ...req.body,
  });

  category = await Category.find().sort({
    order: 1,
  });

  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.delCategory = catchAsync(async (req, res, next) => {
  let category = await Category.deleteOne({
    _id: req.body._id,
  });

  category = await Category.find().sort({
    order: 1,
  });

  res.status(200).json({
    status: "success",
    data: category,
  });
});