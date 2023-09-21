const mongoose = require("mongoose");

const custumerSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhoneNo: { type: String, required: true },
    custumerAmount: { type: String, required: true },
    status: { type: String , default :"customer" },

    custumerServices_id: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "custumerService",
      required: true
    }],
    cashAmount: { type: String , default : 0 },
    cardAmount: { type: String , default : 0},
    paytmAmount: { type: String , default : 0 },


    createdDateTime: {type: String},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("customer", custumerSchema);
