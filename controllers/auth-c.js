const jwt = require("jsonwebtoken");
const {
  promisify
} = require("util");
const User = require("./../models/user-m");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");


const JWT_SECRET = "thi$.i$_a-j3t_$ecr3T%dum6a$$s3c73t%m0yn%fu9k_u_hack3r$";
const JWT_EXPIRES_IN = "72000h"

const signToken = (id) => {
  return jwt.sign({
    id
  }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  let data = req.body;

  let exists = await User.findOne({
    userName: data.userName.toLowerCase()
  })
  if (exists) {
    return res.status(401).json({
      status: 'failed',
      message: 'username already taken'
    })
  }

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
    location: data.location,
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

  const token = signToken(user._id);
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
    req.query.authorization &&
    req.query.authorization.startsWith("Bearer ")
  ) {
    token = req.query.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to continue", 401)
    );
  }

  let decoded = await promisify(jwt.verify)(token, JWT_SECRET);

  res.status(200).json({
    status: 'success',
    decoded,
    user
  })
});

exports.guard = catchAsync(async (req, res, next) => {
  if (!req.query.authorization || req.query.authorization.split(" ")[1].length < 6) {
    return res.status(400).json({
      status: "failed",
      message: "No token was found",
      token: req.query.authorization
    })
  }

  const decodedToken = jwt.verify(req.query.authorization.split(" ")[1], JWT_SECRET);
  req.query.id = decodedToken.id;

  
  let token;
  if (
    req.query.authorization &&
    req.query.authorization.startsWith("Bearer ")
  ) {
    token = req.query.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to continue", 401)
    );
  }
  next();
});