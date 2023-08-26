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
  try {
    const staff = await Staff.find()
    return res.send(staff);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
