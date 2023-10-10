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
    minlength: 8,
    maxlength: 128,
  },

  role : {
    type : String,
    default : "custumer"
  },

  userNumber: {
    type: String,
  },

  saloonNumber : {
    type: String,
  },


  Owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  Admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  adminNumber : {
    type: String,
  },

  state : {
    type: String,
  },

  city : {
    type: String,
  },

  bussinessName : {
    type: String,
  },

  hasSubscription  : {
    type : Boolean,
    default : false
  },

  SubscExpDt  : {
    type : String,
    default : null,
  },

  ActiveStatus : {
    type : String,
  }


});

userSchema.pre("save", function (next, done) {
  if (this.password) {
    const hash = bcrypt.hashSync(this.password, 8);
    this.password = hash;
  }

  return next();
});


userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(
    password,
    this.password,
  );
};



module.exports = mongoose.model("user", userSchema);
