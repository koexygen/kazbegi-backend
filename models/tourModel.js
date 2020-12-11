const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    required: [true, "duration is required"]
  },
  maxGroupSize: {
    type: Number,
    required: [true, "groupSize is required"]
  },
  difficulty: {
    type: String,
    required: [true, "difficulty is required"],
    trim: true
  },
  name: {
    type: String,
    required: [true, "tour must have a Name"],
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, "tour must have a price"],
    min: 150
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "tour must have description"]
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, "tour must have cover image"]
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
