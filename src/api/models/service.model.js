const mongoose = require("mongoose");


const serviceSchema = new mongoose.Schema(

  {
    serviceType: { type: String, required: true },
    serviceName: { type: String, required: true },
    servicePrice: { type: Number, required: true },
    brandName: { type: String },

    
  },
  {
    versionKey: false,
    timestamps: true,
  },

);

module.exports = mongoose.model("service", serviceSchema)

