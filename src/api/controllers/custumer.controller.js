const Custumer = require("../models/custumer.model");
const httpStatus = require("http-status");

exports.create = async (req, res) => {
    try {
        const custumer = new Custumer(req.body);
        const savedcustumer = await custumer.save();
        res.status(httpStatus.CREATED);
        res.send(savedcustumer);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

exports.get = async (req, res) => {
    try {
        const custumer = await Custumer.find()
        .populate({
            path : "custumerServices_id",
            populate: {
                path: 'staff_id',
            } 
        
        }).lean().exec()
        return res.send(custumer);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};
