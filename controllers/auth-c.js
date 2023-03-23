const jwt = require("jsonwebtoken");
const {
  promisify
} = require("util");
const User = require("./../models/user-m");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");


const signToken = (id) => {
  return jwt.sign({
    id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  let data = req.body;

  let {
    password,
    passwordConfirm
  } = data;


  let userName = data.userName ? data.userName.toLowerCase() : data.userName;
  const newUser = await User.create({
    fullName: data.fullName,
    userName: userName,
    phoneNumber: data.phoneNumber,
    password,
    passwordConfirm,
    role: data.role,
    address: data.address,
    contacts: data.contacts
  });

  let token = signToken(newUser._id);

  res.status(200).json({
    status: "success",
    token,
    user: newUser,
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  let {
    userName,
    password
  } = req.query;

  if (!userName || !password) {
    return res.status(404).json({
      status: 'nullField',
      message: 'Please fill in all fields'
    })
  }

  const user = await User.findOne({
    userName: userName.toLowerCase()
  }).select(
    "+password"
  );

  /* if (user && user.banned) {
    return res.status(401).json({
      status: 'banned',
      message: "This account has been banned"
    })
  } */

  const correct = user ?
    await user.correctPassword(password, user.password) :
    false;

  if (!user || !correct) {
    return res.status(404).json({
      status: 'noAccount',
      message: 'Incorrect Username or Password'
    })
  }

  // const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

exports.checkToken = catchAsync(async (req, res, next) => {
  let user = await User.findById({
    _id: req.query.id
  })

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to continue", 401)
    );
  }

  let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
  res.status(200).json({
    status: 'success',
    decoded,
    user
  })
});

exports.guard = catchAsync(async (req, res, next) => {
  const decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
  req.query.id = decodedToken.id;

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to continue", 401)
    );
  }

  let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  next();
});