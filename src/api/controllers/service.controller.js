const Service = require("../models/service.model");
const httpStatus = require("http-status");

exports.create = async (req, res) => {
  try {
    const service = new Service(req.body);
    const savedservice = await service.save();
    res.status(httpStatus.CREATED);
    res.send(savedservice);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};




exports.get = async (req, res) => {
  try {
    const service = await Service.find()
    return res.send(service);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
