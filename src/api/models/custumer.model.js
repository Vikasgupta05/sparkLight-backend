const mongoose = require("mongoose");

let todayData = new Date()

const custumerSchema = new mongoose.Schema(


  {
    customerName: { type: String, required: true },
    customerPhoneNo: { type: String, required: true },
    custumerAmount: { type: String, required: true },
    status: { type: String , default :"customer" },
    owner_id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    custumerServices_id: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "custumerService",
      required: true
    }],
    cashAmount: { type: String , default : 0 },
    cardAmount: { type: String , default : 0},
    paytmAmount: { type: String , default : 0 },
    notiStatus : { type: String },
    activeStatus :{ type: String , default :"online" },
    createdDateTime: {type: String , default :todayData},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("customer", custumerSchema);
