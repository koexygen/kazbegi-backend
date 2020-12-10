const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const tours = await features.data;

    res.status(200).json({
      status: 200,
      data: { tours }
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      data: { error: e }
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 200,
      data: { tour }
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      data: { error: e }
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: { tour }
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      data: { error: e }
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 200,
      data: { tour }
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      data: { error: e }
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(201).json({
      status: "success",
      data: { tour }
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      data: { error: e }
    });
  }
};
