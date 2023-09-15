const Custumer = require("../models/custumer.model");
const CustumerService = require("../models/custumerService.model");
const Staff = require("../models/staff.model");
const httpStatus = require("http-status");

const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');

exports.create = async (req, res) => {
  try {
    let creeateCustService = req.body.billingServiceData;
    const { customerName, customerPhoneNo } = req.body;
    let custumerAmount = 0;

    creeateCustService = creeateCustService.map((item) => {
      return {
        serviceName: item.serviceName,
        servicePrice: item.servicePrice,
        serviceType: item.serviceType,
        staff_id: item.staff_id,
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
      custumerServices_id,
    });
    const afterCustCreate = await savedcustumer.save();
    res.status(httpStatus.CREATED);
    res.send(afterCustCreate);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getStaff = async (req, res) => {
  try {
    const staffs = await Staff.find();
    const startDate = new Date(req.body.formatteStartDate);
    const endDate = new Date(req.body.formattEndDate);
    const startDateString = new Date(startDate);
    startDateString.setDate(startDate.getDate() + 1);
    const updatedStartDateString = startDateString.toISOString();
    const FinalStartDateString = new Date(updatedStartDateString);

    const pipeline = [
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
        $lookup: {
          from: "staffs",
          localField: "custumerServices.staff_id",
          foreignField: "_id",
          as: "staffs",
        },
      },
      {
        $unwind: "$staffs",
      },
      {
        $group: {
          _id: "$custumerServices.staff_id",
          staffName: { $first: "$staffs.staffName" },
          numCustomers: { $sum: 1 },
          totalAmount: { $sum: { $toInt: "$custumerServices.servicePrice" } },
          serviceCreatedAt: { $min: "$custumerServices.createdAt" },
          status : { $first: "$staffs.status" },
        },
      },
    ];

    if (req.body.formatteStartDate != null) {
      pipeline.unshift({
        $match: {
          createdAt: {
            $gte: FinalStartDateString,
            $lte: endDate,
          },
        },
      });
    }

    const testData = await Custumer.aggregate(pipeline);

    staffs.map((item) => {
      const foundObject = testData.find((obj) => {
        return obj._id.equals(item._id);
      });
      if (!foundObject) {
        testData.push({
          _id: item._id,
          staffName: item.staffName,
          numCustomers: 0,
          totalAmount: 0,
        });
      }
      return item;
    });
    return res.send(testData);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.getServiceCount = async (req, res) => {
  try {
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
          
        },
      },
    ]);
    res.status(httpStatus.CREATED);
    res.send(testData);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.get = async (req, res) => {
  try {
    const custumer = await Custumer.find()
      .populate({
        path: "custumerServices_id",
        populate: {
          path: "staff_id",
        },
      })
      .lean()
      .exec();
    return res.send(custumer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


const razorpay = new Razorpay({
  key_id: 'rzp_test_vpd9CKdcgZ4h10', 
  key_secret: 'Zd2RFfoXZRzMgunduNKZvLBR' 
});

exports.razerpay = async (req, res) => {
  try {
 
    const options = {
      amount: 50000, // Amount in paise (50.00 INR)
      currency: 'INR',
    };

    razorpay.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.send(order);
    });  
   
  } catch (err) {
    return res.status(500).send(err.message);
  }
};