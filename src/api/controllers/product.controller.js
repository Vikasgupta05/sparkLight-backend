const Product = require("../models/product.model");
const httpStatus = require("http-status");

exports.create = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedproduct = await product.save();
    res.status(httpStatus.CREATED);
    res.send(savedproduct);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};




exports.get = async (req, res) => {
  try {
    const product = await Product.find()
    return res.send(product);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
