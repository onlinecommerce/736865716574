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
  } else if(req.query.recommand) {
    let { category, subCategory, name } = req.query;
    name = name.split(' ');
    let primary = name.length ? name[0] : '---';
    let secondary = name.length > 1 ? name[1] : '---';
    let both = primary + secondary;
    items = await Item.find({ 
      category, 
      subCategory, 
      id: { $ne: req.query.itemId },
      $or: [
        {
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
    },).select("id name price").limit(req.query.limit);
  } else {
    const feature = new ApiFeatures(
      Item.find().select("id name price"),
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

const createCategory = async (category, subcategory) => {
  let res = await Category.findOne({ category });
  if (res) {
    let subs = res.subcategory;
    let exists = subs.indexOf(subcategory.toLowerCase()) != -1;
    if (!exists) {
      subs.push(subcategory.toLowerCase());
      await Category.updateOne({ category }, { $set: { subcategory: subs }});
    }
  } else {
    await Category.create({
      category,
      subcategory: [subcategory]
    })
  }
}

exports.createItem = catchAsync(async (req, res, next) => {
  let {
    subCategory,
    category,
    quantity,
    measurment,
    price,
    description,
    status,
  } = req.body;
  let postedBy = req.body.postedBy || req.query.id;
  let name = req.body.name || null;

  let data = {
    subCategory,
    category,
    quantity,
    measurment,
    price,
    postedBy,
    description,
    status,
    name
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
