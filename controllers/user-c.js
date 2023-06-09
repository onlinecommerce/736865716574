const User = require("./../models/user-m");
const catchAsync = require("./../utils/catchAsync");

const bcrypt = require("bcryptjs");

exports.getUser = catchAsync(async (req, res, next) => {
  let user = await User.findById({
    _id: req.query.userId,
  });
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.searchUser = catchAsync(async (req, res, next) => {
  let skip = req.query.skip || 0;
  let limit = req.query.limit || 0;
  let user = await User.find({
    userName: {
      $regex: req.query.userName,
      $options: "i",
    },
  })
    .select("-id")
    .sort("-created_at")
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.delUser = catchAsync(async (req, res, next) => {
  let user_id = req.query.user_id;

  let user = await User.deleteOne({
    _id: user_id,
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.changeRole = catchAsync(async (req, res, next) => {
  let user_id = req.query.user_id;
  let role = req.query.role;
  let user = await User.updateOne(
    {
      _id: user_id,
    },
    {
      $set: {
        role,
      },
    }
  );
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.changeOrder = catchAsync(async (req, res, next) => {
  let user_id = req.query.user_id;
  let order = req.query.order;
  let user = await User.updateOne(
    {
      _id: user_id,
    },
    {
      $set: {
        order,
      },
    }
  );
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.changeAdPosting = catchAsync(async (req, res, next) => {
  let user_id = req.query.user_id;
  let postPerDay = +req.query.postPerDay;
  let user = await User.updateOne(
    {
      _id: user_id,
    },
    {
      $set: {
        postPerDay,
      },
    }
  );
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  let data = {
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
    location: req.body.location,
    contacts: req.body.contacts,
  };

  let user = await User.updateOne(
    {
      _id: req.query.id,
    },
    data
  );

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  let { oldPassword, newPassword, newPasswordConfirm } = req.body;

  let usr = await User.findById({
    _id: req.query.id,
  }).select("+password");

  const correct = usr
    ? await usr.correctPassword(oldPassword, usr.password)
    : false;

  if (!correct) {
    return res.status(404).json({
      status: "noAccount",
      message: "Incorrect Password",
    });
  }

  if (newPassword !== newPasswordConfirm) {
    return res.status(404).json({
      status: "noAccount",
      message: "Passwords didn't match",
    });
  }

  newPassword = await bcrypt.hash(newPassword, 12);

  usr = await User.updateOne(
    {
      _id: usr.id,
    },
    {
      $set: {
        password: newPassword,
      },
    }
  );

  res.status(200).json({
    status: "success",
    data: usr,
  });
});

exports.checkUsername = catchAsync(async (req, res, next) => {
  let user = await User.findOne({
    userName: req.query.userName,
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.addSaved = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user, {
    $addToSet: {
      saved: req.query.itemId,
    },
  });

  res.status(201).json({
    status: "success",
    data: true,
  });
});

exports.removeSaved = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user, {
    $pull: {
      saved: req.query.itemId,
    },
  });

  res.status(201).json({
    status: "success",
    data: true,
  });
});

exports.getSaved = catchAsync(async (req, res, next) => {
  let savedItem = await User.findById(req.user, { saved: 1 }).populate({
    path: "saved",
    populate: { path: "postedBy", model: "User" },
  });

  res.status(200).json({
    status: "success",
    data: savedItem.saved,
  });
});
