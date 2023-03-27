const Item = require("./../models/item-m");
const catchAsync = require("./../utils/catchAsync");
const ApiFeatures = require('../utils/APIFeatures');

exports.getItems = catchAsync(async (req, res, next) => {
  let items;
  if (req.query._id) {
    const feature = new ApiFeatures(
      Item.findById().populate("postedBy"),
      req.query)
      .filter();
    items = await feature.query;
  } else {
    const feature = new ApiFeatures(
      Item.find().populate("postedBy"),
      req.query)
      .filter()
      .sort()
      .paginate();
    items = await feature.query;
  }

  res.status(200).json({
    status: 'success',
    items
  })
})

exports.filterByDate = catchAsync(async (req, res) => {
  let filterBy = req.query.filterByDate;

})

exports.searchItems = catchAsync(async (req, res, next) => {
  let items = await Item.find({
    $or: [{
      category: {
        $regex: req.query.search,
        $options: 'i'
      }
    },
    {
      subCategory: {
        $regex: req.query.search,
        $options: 'i'
      }
    }
    ]
  })
    .skip((Number(req.query.page) - 1) * Number(req.query.by))
    .limit(Number(req.query.by))
    .sort({
      updated_at: -1
    }).populate("postedBy")

  res.status(200).json({
    status: 'success',
    data: items
  })
})

exports.createItem = catchAsync(async (req, res, next) => {
  let {
    subCategory,
    category,
    quantity,
    measurment,
    price,
    available,
    postedBy
  } = req.body;
  postedBy = postedBy || req.query.id;

  let data = {
    subCategory,
    category,
    quantity,
    measurment,
    price,
    available,
    postedBy,
  }
  let item = await Item.create(data);
  res.status(200).json({
    status: 'success',
    item
  })
})

exports.update = catchAsync(async (req, res, next) => {
  let _item = await Item.findById({
    _id: req.query.itemId
  });
  let data = {
    ...req.body,
  }

  let item = await Item.updateOne({
    _id: req.query.itemId
  }, data)

  res.status(200).json({
    status: 'success',
    data: item
  })
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  let itemId = req.query.itemId;
  let result = await Item.deleteOne({
    _id: itemId
  })
  res.status(200).json({
    status: "success",
    data: result
  })
})
