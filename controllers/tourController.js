const Tour = require("../models/tourModel");

exports.getAllTours = (req, res) => {};

exports.getTour = (req, res) => {};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: { tour: newTour }
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      data: { error: e }
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>"
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null
  });
};
