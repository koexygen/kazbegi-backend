const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(
    ({ name, email, role, password, passwordConfirm } = req.body)
  );

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide a valid email or password"), 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password"), 401);
  }

  const token = signToken(user._id);

  res.status(201).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    next(
      new AppError("You are not logged in, please login to get access", 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const foundUser = await User.findById(decoded.id);

  if (!foundUser)
    next(new AppError("User belonging to this token was deleted.", 401));

  if (foundUser.changedPasswordAfter(decoded.iat))
    next(
      new AppError("Password has changed recently, please login again", 401)
    );

  req.user = foundUser;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("You don't have permission for this action", 403));
  }

  next();
};
