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




exports.getadminStaff = async (req, res) => {
  try {
    const id = req.body.id
    const testData = await Staff.aggregate([

      {
        $match: {
          owner_id: {
            $in: ["651030bdcb9274e131c0bc78", "651030fbcb9274e131c0bc7e"],
          },
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
          preserveNullAndEmptyArrays: true 
        },
      },

      
      {
        $group: {
          _id: "$_id",
          staffName: { $first: "$staffName" },
          owner_id : {$first: "$owner_id"},
          numCustomers: {
            $sum: {
              $cond: [
                { $ifNull: ["$custumerServices", false] },
                1,
                0
              ]
            }
          },
          totalService: { $push: "$custumerServices" },
          totalAmount: { $sum: { $toInt: "$custumerServices.servicePrice" } },
          serviceCreatedAt: { $min: "$custumerServices.createdAt" },
          status : { $first: "$status" },
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
          totalService : 1,
          owner_id : 1
        }
      }
    ])

    // console.log("testData" , testData)
    return res.send(testData); 

  } catch (err) {
    return res.status(500).send(err.message);
  }
};



