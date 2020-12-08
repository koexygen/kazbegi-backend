const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    console.log("connected to database");
  });

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
    required: [true, "tour must have a price"]
  }
});

const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "სატესტო ტური",
  rating: 4,
  price: 450
});

testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log("ERROR: ", err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
