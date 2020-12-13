const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "rating must be from 1-5"],
      max: [1, "rating must be from 1-5"]
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
      trim: true,
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "incorrect value"
      }
    },
    name: {
      type: String,
      required: [true, "tour must have a Name"],
      unique: true,
      trim: true,
      maxlength: [40, "tour must have less or equal to 40 characters name"],
      minlength: [10, "tour must have at least 10 characters name"]
    },
    price: {
      type: Number,
      required: [true, "tour must have a price"],
      min: 150
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: "discount price ({VALUE}) should be lower regular price",
        validator: function(val) {
          return val < this.price;
        }
      }
    },
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
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false
    }
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual("durationWeek").get(function() {
  return this.duration / 7;
});

tourSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post("save", function(doc, next) {
  this.find({ secretTour: false });
  next();
});

tourSchema.pre(/^find/, function(next) {
  next();
});

tourSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
