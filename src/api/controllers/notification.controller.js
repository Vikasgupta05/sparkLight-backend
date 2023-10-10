const Notification = require("../models/notification");
const httpStatus = require("http-status");



exports.create = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const savednotification = await notification.save();
    res.status(httpStatus.CREATED);
    res.send(savednotification);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};



exports.get = async (req, res) => {
  const id = req.params.id
  try {
    const notification = await Notification.find({ Owner_id: id })
    return res.send(notification);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.update =  async (req, res) => {
    try{
      const notification = await Notification.findByIdAndUpdate(req.body._id,
        { $set: { status: req.body.status }},
        {new:true})
      res.send(notification)
    }
    catch(err){
      res.send(err.message);
    }
  };


exports.delete = async (req, res) => {
    try {
      const _id = req.params.id;
      const notification = await Notification.findByIdAndDelete(_id);
      if (notification) {
        return res.send(notification);
      } else {
        return res.json({
          status: "error",
          error: "notification not found!",
        });
      }
    } catch (err) {
      return res.status(500).send(err.message);
    }
  };


  exports.check = async (req, res) => {
    try {
        const { staffId, requestSendBy } = req.body;
        const existingRequest = await Notification.findOne({
          staffId,
          requestSendBy,
        });
    
        if (existingRequest) {
          return res.json({ status: "error", error: "Request already sent" });
        }
        return res.json({ status: "success", message: "Request can be sent" });
      } catch (err) {
        return res.status(500).send(err.message);
      }
  };

  
