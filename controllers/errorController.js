const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
  const message = `invalid error ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleErrorDuplicateDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}, please change the value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = err.values().map(err => err.message);
  const message = `invalid input data. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error(err);

    res.status(500).json({
      status: "fail",
      message: "something went wrong...!"
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleErrorDuplicateDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
