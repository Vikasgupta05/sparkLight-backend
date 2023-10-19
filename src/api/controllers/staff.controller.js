const Staff = require("../models/staff.model");
const User = require("../models/client.model");


const httpStatus = require("http-status");
const { ObjectId } = require("mongodb");

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
  const id = req?.params?.id;
  try {
    const staff = await Staff.find();
    return res.send(staff);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.body._id,
      { $set: { status: req.body.status } },
      { new: true }
    );
    res.send(staff);
  } catch (err) {
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

exports.getadminStaff = async (req, res) => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    const id = req.body;
    const startDate = new Date(id.startDate);
    const endDate = new Date(id.endDate);
    let matchQuery = {};
    const owners = await User.find({ role: "owner" }).select("_id");
    let owner_id = {
      $in: owners.map((user) => user._id),
    };

    if (startDate == "Invalid Date") {
      matchQuery = {
        owner_id: owner_id,
        "custumerServices.createdAt": {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
        
      };
    } else {
      matchQuery = {
        owner_id: owner_id,
        "custumerServices.createdAt": {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }

    const testData = await Staff.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner_id",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $unwind: {
          path: "$users",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "custumerservices",
          localField: "_id",
          foreignField: "staff_id",
          as: "custumerServices",
        },
      },
      {
        $unwind: {
          path: "$custumerServices",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: matchQuery,
      },
      
      {
        $group: {
          _id: "$_id",
          staffName: { $first: "$staffName" },
          owner_id: { $first: "$owner_id" },
          numCustomers: {
            $sum: {
              $cond: [{ $ifNull: ["$custumerServices", false] }, 1, 0],
            },
          },
          totalService: { $push: "$custumerServices" },
          totalAmount: { $sum: { $toInt: "$custumerServices.servicePrice" } },
          serviceCreatedAt: { $min: "$custumerServices.createdAt" },
          status: { $first: "$status" },
          ownerName: { $first: "$users.userName" },
          bussinessName: { $first: "$users.bussinessName" },
          city: { $first: "$users.city" },
        },
      },
      {
        $project: {
          _id: 1,
          staffName: 1,
          numCustomers: 1,
          totalAmount: 1,
          serviceCreatedAt: 1,
          status: 1,
          totalService: 1,
          owner_id: 1,
          ownerName: 1,
          bussinessName: 1,
          city: 1,
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    return res.send(testData);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
