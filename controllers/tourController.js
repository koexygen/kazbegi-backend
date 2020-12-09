const Tour = require("../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach(el => delete queryObj[el]);

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    const query = Tour.find(JSON.parse(queryStr));
    const tours = await query;

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
