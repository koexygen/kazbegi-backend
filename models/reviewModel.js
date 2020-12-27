const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, "Review Cannot be empty"] },
    rating: {
      type: Number,
      min: [1, "Minimum rating allowed 1"],
      max: [5, "Maximum rating allowed 5"],
    },
    createdAt: { type: Date, default: Date.now },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must have an author."],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a Tour"],
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "author",
    select: "name photo",
  });

  next();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;