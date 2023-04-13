const ApiFeatures = require("../utils/APIFeatures");
const catchAsync = require("./../utils/catchAsync");
const Category = require("./../models/category-m");

exports.getCategory = catchAsync(async (req, res, next) => {
  let category;
  if (req.query.distinct) {
    category = await Category.find().distinct("category");
    // let temp = await Category.countDocuments({category: category[0]});
  } else if (req.query.category && !req.query.subcategory) {
    const feature = new ApiFeatures(Category.findOne(), req.query).filter();
    category = await feature.query;
    category = category[0].length ? category : category[0].subcategory;
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