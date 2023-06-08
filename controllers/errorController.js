const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = err.customMessage;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = JSON.stringify(err.keyValue);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid Token. Please Login again", 401);
const handleJWTExpiredError = () =>
  new AppError("Your Token expired. Please Login again", 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(err.statusCode).json({
    title: "Something went wrong!",
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    return res.status(500).json({
      status: "Error",
      message: "Something went wrong!",
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      title: "Something went wrong!",
      message: err.message,
    });
  }

  return res.status(err.statusCode).json({
    title: "Something went wrong!",
    message: "Please Try again later.",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  err.customMessage = JSON.stringify(err.customMessage) || false;
  //   process.env.NODE_ENV = "DEVELOPMENT";
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };

    if (err.customMessage) {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error._message === "validation failed") {
      error = handleValidationErrorDB(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }
    sendErrorProd(error, req, res);
  }
};
