const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  rating: {
    type: Number,
    default: 4.5
  },
  name: {
    type: String,
    required: [true, "tour must have a Name"],
    unique: true
  },
  price: {
    type: Number,
    required: [true, "tour must have a price"],
    min: 150
  }
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
