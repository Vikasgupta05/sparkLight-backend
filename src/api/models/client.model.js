const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { boolean } = require("joi");

const userSchema = new mongoose.Schema({

  userName: {
    type: String,
  },

  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    minlength: 6,
    maxlength: 128,
  },
});

userSchema.pre("save", function (next, done) {
  if (this.password) {
    const hash = bcrypt.hashSync(this.password, 8);
    this.password = hash;
  }

  return next();
});



module.exports = mongoose.model("user", userSchema);
