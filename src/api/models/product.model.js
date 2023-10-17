const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(

  {
    productBrand: { type: String, required: true },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },

);

module.exports = mongoose.model("product", productSchema)

