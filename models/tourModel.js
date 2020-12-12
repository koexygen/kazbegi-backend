const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
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

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
