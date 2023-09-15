const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema(

  {
    cash: { type: String},
    paytm: { type: Number},
    card: { type: String},
  },
  {
    versionKey: false,
    timestamps: true,
  },

);

module.exports = mongoose.model("payment", paymentSchema)

