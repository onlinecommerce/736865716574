const Item = require("./../models/item-m");
const Category = require("./../models/category-m");
const catchAsync = require("./../utils/catchAsync");
const ApiFeatures = require('../utils/APIFeatures');
const cloudinary = require('../utils/cloudinary');

exports.getItems = catchAsync(async (req, res, next) => {
  let items;
  let allItems = false;
  let nItems = await Item.countDocuments();
  if (req.query._id) {
    const feature = new ApiFeatures(
      Item.findById().populate("postedBy"),
      req.query)
      .filter();
    items = await feature.query;
    items = items.length > 0 ? items[0] : null;
  } else if (req.query.recommand) {
    let {
      category,
      subCategory,
      name
    } = req.query;
    name = name ? name.split(' ') : '';
    let primary = name.length ? name[0] : '---';
    let secondary = name.length > 1 ? name[1] : '---';
    let both = primary + secondary;
    items = await Item.find({
      category,
      subCategory,
      id: {
        $ne: req.query.itemId
      },
      $or: [{
        name: {
          $regex: new RegExp(primary),
          $options: 'i'
        }
      },
      {
        name: {
          $regex: new RegExp(secondary),
          $options: 'i'
        }
      },
      {
        name: {
          $regex: new RegExp(both),
          $options: 'i'
        }
      }
      ],
    },).populate("postedBy").select("id name price postedBy negotiable").limit(req.query.limit);
  } else {
    const feature = new ApiFeatures(
      Item.find().populate("postedBy").select({
        id: 1,
        _id: 1,
        name: 1,
        price: 1,
        postedBy: 1,
        negotiable: 1
      }), //.select("id name price postedBy"),
      req.query)
      .filter()
      .sort()
      .paginate();
    items = await feature.query;
    if (+req.query.limit > nItems) allItems = true;
  }

  res.status(200).json({
    status: 'success',
    items,
    allItems
  })
})

exports.searchItems = catchAsync(async (req, res, next) => {
  let items = await Item.find({
    $or: [
      /* {
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
  } */
      {
        name: {
          $regex: req.query.search,
          $options: 'i'
        }
      },
    ]
  })
    .skip((Number(req.query.page) - 1) * Number(req.query.limit))
    .limit(Number(req.query.limit))
    .sort({
      updated_at: -1
    }).select("id category subCategory name price status");

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
    negotiable,
    description,
    status,
  } = JSON.parse(req.body.data);
  let postedBy = JSON.parse(req.body.data).postedBy || req.query.id;
  let name = JSON.parse(req.body.data).name || null;

  cloudinary.uploader.upload(req.file.path).then(async function(data) {
    let _data = {
      subCategory,
      category,
      quantity,
      measurment,
      price,
      negotiable,
      postedBy,
      description,
      status,
      name,
      image: data
    }
    let item = await Item.create(_data);
    res.status(200).json({
      status: 'success',
      item,
      postPerDay: req.query.postPerDay
    })

  }).catch(function(error) {
    console.log(error);
    res.status(200).json({
      status: 'fail',
      message: "cloudinary error"
    })
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
  });
  res.status(200).json({
    status: "success",
    data: result
  })
})
