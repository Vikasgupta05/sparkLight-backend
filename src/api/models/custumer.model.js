const mongoose = require("mongoose");

const custumerSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhoneNo: { type: String, required: true },
    custumerAmount: { type: String, required: true },
    custumerServices_id: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "custumerService",
      required: true
    }],
    createdDateTime: {type: String},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("customer", custumerSchema);
