const Custumer = require("../models/custumer.model");
const CustumerService = require("../models/custumerService.model");
const Staff = require("../models/staff.model");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const { sendMsg } = require("../utils/msgSend");


exports.create = async (req, res) => {
  try {


    let creeateCustService = req?.body?.billingServiceData;
    const { customerName, customerPhoneNo ,cashAmount , cardAmount , paytmAmount ,owner_id } = req?.body;
    let custumerAmount = 0;

    creeateCustService = creeateCustService?.map((item) => {
      return {
        serviceName: item.serviceName,
        servicePrice: item.servicePrice,
        serviceType: item.serviceType,
        staff_id: item.staff_id,
        customerName : item.customerName,
        customerPhoneNo : item.customerPhoneNo,
        owner_id : owner_id
      };
    });


    const aftercreateCustumerService = await CustumerService.insertMany(
      creeateCustService
    );
    let custumerServices_id = aftercreateCustumerService.map((item) => {
      custumerAmount =
        parseFloat(custumerAmount) + parseFloat(item.servicePrice);
      return item._id;
    });
    const savedcustumer = new Custumer({
      customerName,
      customerPhoneNo,
      custumerAmount,
      cashAmount,
      cardAmount,
      paytmAmount,
      custumerServices_id,
      owner_id

    });

    const afterCustCreate = await savedcustumer.save();
    res.status(httpStatus.CREATED);
    res.send(afterCustCreate);
    // if(afterCustCreate){
    //   sendMsg(req.body)
    // }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};



exports.getStaffWithDetails = async (req, res) => {
  const staffId = req.body.staffId
  try {
    const testDatas = await Custumer.aggregate([

      {
        $lookup: {
          from: "staffs",
          localField: "custumerServices.staff_id",
          foreignField: "_id",
          as: "staffs",
        },
      },
      {
        $unwind: {
          path: "$staffs",
          preserveNullAndEmptyArrays: true 
        },
      },


      
      {
        $lookup: {
          from: "custumerservices",
          localField: "custumerServices_id",
          foreignField: "_id",
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
        $match: {
          "custumerServices.staff_id": mongoose.Types.ObjectId(`${staffId}`)
        }
      },
      
      
      {
        $group: {
          _id: "$custumerServices.staff_id",
          staffName: { $first: "$staffs.staffName" },
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
          totalName: { $push: "$customerName" },
          totalAmount: { $sum: { $toInt: "$custumerServices.servicePrice" } },
          serviceCreatedAt: { $min: "$custumerServices.createdAt" },
          status: { $first: "$staffs.status" },
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
              totalService:1,
            }
          }
    ]);

    return res.send(testDatas);
    
    
  } catch (err) {
    return res.status(500).send(err.message);
  }
};




exports.getStaff = async (req, res) => {
  try {
    const staffs = await Staff.find();
    // const startDate = new Date(req.body.formatteStartDate);
    // const endDate = new Date(req.body.formattEndDate);
    // const startDateString = new Date(startDate);
    // startDateString.setDate(startDate.getDate() + 1);
    // const updatedStartDateString = startDateString.toISOString();
    // const FinalStartDateString = new Date(updatedStartDateString);

    // const pipeline = [
    //   {
    //     $lookup: {
    //       from: "custumerservices",
    //       localField: "custumerServices_id",
    //       foreignField: "_id",
    //       as: "custumerServices",
    //     },
    //   },
    //   {
    //     $unwind: "$custumerServices",
    //   },
    //   {
    //     $lookup: {
    //       from: "staffs",
    //       localField: "custumerServices.staff_id",
    //       foreignField: "_id",
    //       as: "staffs",
    //     },
    //   },
    //   {
    //     $unwind: "$staffs",
    //   },
    //   {
    //     $group: {
    //       _id: "$custumerServices.staff_id",
    //       staffName: { $first: "$staffs.staffName" },
    //       numCustomers: { $sum: 1 },
    //       totalAmount: { $sum: { $toInt: "$custumerServices.servicePrice" } },
    //       serviceCreatedAt: { $min: "$custumerServices.createdAt" },
    //       status : { $first: "$staffs.status" },
    //     },
    //   },
    // ];


    // if (req.body.formatteStartDate != null) {
    //   pipeline.unshift({
    //     $match: {
    //       createdAt: {
    //         $gte: FinalStartDateString,
    //         $lte: endDate,
    //       },
    //     },
    //   });
    // }

    // const testData = await Custumer.aggregate(pipeline);

    const id = req.body.id




    const testData = await Staff.aggregate([
      
      {
        $match: {
          owner_id:  ObjectId(id)
        }
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
      },
      {
        $sort: { totalAmount: -1 } 
      },
    ])

    // console.log("testData" , testData)
    return res.send(testData); 

    // staffs.map((item) => {
    //   const foundObject = testData.find((obj) => {
    //     return obj._id.equals(item._id);
    //   });
    //   if (foundObject) {
    //     testData.push({
    //       _id: item._id,
    //       staffName: item.staffName,
    //       numCustomers: 0,
    //       totalAmount: 0,
    //     });
    //   }
    //   return item;
    // });
    // return res.send(testData);
  } catch (err) {
    return res.status(500).send(err.message);
  }


  
};


// exports.getStaff = async (req, res) => {
//   try {
//     // const staffs = await Staff.find();
//     // const startDate = new Date(req.body.formatteStartDate);
//     // const endDate = new Date(req.body.formattEndDate);
//     // const startDateString = new Date(startDate);
//     // startDateString.setDate(startDate.getDate() + 1);
//     // const updatedStartDateString = startDateString.toISOString();
//     // const FinalStartDateString = new Date(updatedStartDateString);

//     const pipeline = [
//       {
//         $lookup: {
//           from: "custumerservices",
//           localField: "custumerServices_id",
//           foreignField: "_id",
//           as: "custumerServices",
//         },
//       },
//       {
//         $unwind: "$custumerServices",
//       },
//       {
//         $lookup: {
//           from: "staffs",
//           localField: "custumerServices.staff_id",
//           foreignField: "_id",
//           as: "staffs",
//         },
//       },
//       {
//         $unwind: "$staffs",
//       },
//       {
//         $group: {
//           _id: "$custumerServices.staff_id",
//           staffName: { $first: "$staffs.staffName" },
//           numCustomers: { $sum: 1 },
//           totalAmount: { $sum: { $toInt: "$custumerServices.servicePrice" } },
//           serviceCreatedAt: { $min: "$custumerServices.createdAt" },
//           status : { $first: "$staffs.status" },
//         },
//       },
//     ];


//     // if (req.body.formatteStartDate != null) {
//     //   pipeline.unshift({
//     //     $match: {
//     //       createdAt: {
//     //         $gte: FinalStartDateString,
//     //         $lte: endDate,
//     //       },
//     //     },
//     //   });
//     // }

//     const testData = await Custumer.aggregate(pipeline);
//     // console.log("pipeline" , testData)

//     // staffs.map((item) => {
//     //   const foundObject = testData.find((obj) => {
//     //     return obj._id.equals(item._id);
//     //   });
//     //   if (foundObject) {
//     //     testData.push({
//     //       _id: item._id,
//     //       staffName: item.staffName,
//     //       numCustomers: 0,
//     //       totalAmount: 0,
//     //     });
//     //   }
//     //   return item;
//     // });
//     return res.send(testData);
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// };



exports.getServiceCount = async (req, res) => {
  const SelectedDate = req.body.SelectedDate
  const today = new Date();
  try {
    const formattedToday = today.toISOString().split('T')[0];
    const testData = await Custumer.aggregate([
      {
        $lookup: {
          from: "custumerservices",
          localField: "custumerServices_id",
          foreignField: "_id",
          as: "custumerServices",
        },
      },
      {
        $unwind: "$custumerServices",
      },
      {
        $match: {
          $expr: {
            $eq: [
              {
                $dateToString: { format: "%Y-%m-%d", date: "$custumerServices.createdAt" }
              },

              {
                $cond: {
                  if: { $ne: [SelectedDate, ""] },
                  then: SelectedDate,
                  else: formattedToday
                }
              }
            ]
          }
        },
      },

      {
        $group: {
          _id: "$custumerServices.serviceName",
          serviceType: { $first: "$custumerServices.serviceType" },
          serviceName: { $first: "$custumerServices.serviceName" },
          servicePrice: { $first: "$custumerServices.servicePrice" },
          servicePriceSum: {
            $sum: { $toInt: "$custumerServices.servicePrice" },
          },
          serviceCreatedAt: { $min: "$custumerServices.createdAt" },
          serviceCount: { $sum: 1 },
          owner_id : { $first: "$custumerServices.owner_id" },
        },
      },
      {
        $sort: { _id: -1 } 
      },
    ]);
  
    res.status(httpStatus.CREATED);
    res.send(testData);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.get = async (req, res) => {
  const id = req.params.id
  try {
    const custumer = await Custumer.find({ owner_id: id })
      .populate({
        path: "custumerServices_id",
        populate: {
          path: "staff_id",
        },
      })
      .sort({ _id: -1 })
      .lean()
      .exec();
    return res.send(custumer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.update =  async (req, res) => {
  try{
    const custumer = await Custumer.findByIdAndUpdate(req.body._id,
      { $set: { activeStatus: req.body.activeStatus }},
      {new:true})
    res.send(custumer)
  }
  catch(err){
    res.send(err.message);
  }
};





exports.delete = async (req, res) => {
  try {
    const _id = req.params.id;
    const custumer = await Custumer.findByIdAndDelete(_id);
    if (custumer) {
      return res.send(custumer);
    } else {
      return res.json({
        status: "error",
        error: "custumer not found!",
      });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
