const Staff = require("../models/staff.model");
const httpStatus = require("http-status");


exports.create = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    const savedstaff = await staff.save();
    res.status(httpStatus.CREATED);
    res.send(savedstaff);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};




exports.get = async (req, res) => {
  const id = req?.params?.id
  try {
    const staff = await Staff.find()
    return res.send(staff);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.update =  async (req, res) => {
  try{
    const staff = await Staff.findByIdAndUpdate(req.body._id,
      { $set: { status: req.body.status }},
      {new:true})
    res.send(staff)
  }
  catch(err){
    res.send(err.message);
  }
};




exports.delete = async (req, res) => {
  try {
    const _id = req.body._id;
    const staff = await Staff.findByIdAndDelete(_id);

    if (staff) {
      return res.send(staff);

    } else {
      return res.json({
        status: "error",
        error: "Staff not found!",
      });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};




