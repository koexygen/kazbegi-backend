const Tour = require("../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };

    //ფილტრაცია
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach(el => delete queryObj[el]);
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );
    let query = Tour.find(JSON.parse(queryStr));
    //სორტი
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }

    //ლიმიტი
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //პაგინაცია
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page || req.query.limit) {
      const numTours = await Tour.countDocuments();

      if (skip >= numTours) {
        throw new Error("this page doesnt exists");
      }
    }

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
