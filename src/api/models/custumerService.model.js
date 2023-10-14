const mongoose = require("mongoose");


const custumerServiceSchema = new mongoose.Schema(

  {
    serviceType: { type: String, required: true },
    serviceName: { type: String, required: true },
    servicePrice: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhoneNo: { type: String, required: true },
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staff",
      required: true,   
    },
    owner_id: { type: String }
    
  },
  {
    versionKey: false,
    timestamps: true,
  },

);

module.exports = mongoose.model("custumerService", custumerServiceSchema)

