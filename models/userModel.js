const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide ur name"]
  },

  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email address"]
  },

  photo: String,

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm a password"]
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
