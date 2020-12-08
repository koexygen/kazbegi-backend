const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const Tour = require("./models/tourModel");

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
  .then(con => console.log("connected to database"));

const testTour = new Tour({
  name: "სატესტო ტური2",
  rating: 4,
  price: 155
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
