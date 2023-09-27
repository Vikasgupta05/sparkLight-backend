const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema(

  {
    staffId: {type : String},
    requestSendBy: { type: String},
    StaffName: { type: String},
    message: { type: String},
    status: { type: String},
    userId: {type :String},
    custumerId: {type :String},
    Owner_id: {type :String}
    
  },
  {
    versionKey: false,
    timestamps: true,
  },

);

module.exports = mongoose.model("notification", notificationSchema)

