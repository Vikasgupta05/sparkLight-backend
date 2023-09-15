const mongoose = require("mongoose");


const staffSchema = new mongoose.Schema(

  {

    staffName: { type: String },
    totalCustumer: { type: String },
    totalSale: { type: String },
    custumer_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "custumer",
    }],
    status: { type: String  },
    
  },
  {
    versionKey: false,
    timestamps: true,
  },

);

module.exports = mongoose.model("staff", staffSchema)

