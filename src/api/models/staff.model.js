const mongoose = require("mongoose");


const staffSchema = new mongoose.Schema(

  {
    staffName: { type: String },
    totalCustumer: { type: String },
    totalSale: { type: String },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    custumer_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "custumer",
    }],
    status: { type: String , default : "add"  },
    
  },
  {
    versionKey: false,
    timestamps: true,
  },

);

module.exports = mongoose.model("staff", staffSchema)

