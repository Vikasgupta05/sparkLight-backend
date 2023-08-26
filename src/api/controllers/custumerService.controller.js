const CustumerService = require("../models/custumerService.model");
const httpStatus = require("http-status");

exports.create = async (req, res) => {
  try {
    const custumerService = new CustumerService(req.body);
    const savedcustumer = await custumerService.save();
    res.status(httpStatus.CREATED);
    res.send(savedcustumer);
} catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.post = async (req, res) => {
  try {
    let custumerService = [];
    if (req.body.serviceType) {
      custumerService = await CustumerService.find({ serviceType: req.body.serviceType }).lean().exec();
    } else {
      custumerService = await CustumerService.find().lean().exec()
    }
    return res.send(custumerService)
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
};


exports.get = async (req, res) => {
  try {
    const custumer = await CustumerService.find()
    return res.send(custumer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
 
};
