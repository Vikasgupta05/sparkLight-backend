require("dotenv").config();
const User = require("../models/client.model");
const Custumer = require("../models/custumer.model");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const jwtToken = require("../utils/token");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

exports.register = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    let owner = await User.findOne({
      userNumber: req.body.saloonNumber,
      role: "owner",
    });
    let password = req.body.password;
    let userNumber = req.body.userNumber;
    let userEmail = req.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (user) {
      return res.json({
        status: "error",
        error: "user have already register ",
      });
    } else if (userNumber.length != 10) {
      return res.json({
        status: "error",
        error: "Invalid user number ",
      });
    } else if (!emailRegex.test(userEmail)) {
      return res.json({
        status: "error",
        error: "Invalid email address ",
      });
    } else if (!owner) {
      return res.json({
        status: "error",
        error: "Invalid saloon owner number ",
      });
    } else if (password.length < 8) {
      return res.json({
        status: "error",
        error: "password minimum 8 chracter ! ",
      });
    } else {
      user = await User.create({ ...req.body, Owner_id: owner._id });
      if (user) {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "sparklight2564@gmail.com",
            pass: "vmwkioxwjbjfqkbd",
          },
        });

        var mailOptions = {
          from: "sparklight2564@gmail.com",
          to: req.body.email,
          subject: "Your Account register succesfully ",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
      return res.json({ status: httpStatus.CREATED, userId: user });
    }
  } catch (err) {
    return res.send(err.message);
  }
};

exports.login = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ status: "error", error: "Invalid password or email" });
    } else if (user.role !== req.body.role) {
      return res.json({
        status: "error",
        error: `Please go with ${user.role} login`,
      });
    } else {
      const match = user.checkPassword(req.body.password);
      if (!match) {
        return res.json({
          status: "error",
          error: "Invalid password or email",
        });
      }
      const token = jwtToken.createJwtToken(user);
      return res.json({
        status: httpStatus.OK,
        data: user,
        token: token,
        user: user.userName,
        role: user.role,
        userId: user._id,
      });
    }
  } catch (err) {
    return res.send(err.message);
  }
};

exports.ownerRegister = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    let admin = await User.findOne({
      userNumber: req.body.adminNumber,
      role: "admin",
    });
    let password = req.body.password;
    let userNumber = req.body.userNumber;
    let userEmail = req.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!admin) {
      return res.json({
        status: "error",
        error: "Invalid admin number",
      });
    } else if (user) {
      return res.json({
        status: "error",
        error: "user have already register ",
      });
    } else if (userNumber.length != 10) {
      return res.json({
        status: "error",
        error: "Invalid user number ",
      });
    } else if (!emailRegex.test(userEmail)) {
      return res.json({
        status: "error",
        error: "Invalid email address ",
      });
    } else if (password.length < 8) {
      return res.json({
        status: "error",
        error: "password minimum 8 chracter ! ",
      });
    } else {
      user = await User.create({ ...req.body, Admin_id: admin._id });
      if (user) {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "sparklight2564@gmail.com",
            pass: "vmwkioxwjbjfqkbd",
          },
        });

        var mailOptions = {
          from: "sparklight2564@gmail.com",
          to: req.body.email,
          subject: "Your Account register succesfully ",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
      return res.json({ status: httpStatus.CREATED, userId: user });
    }
  } catch (err) {
    return res.send(err.message);
  }
};

exports.adminRegister = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    let password = req.body.password;
    let userNumber = req.body.userNumber;
    let userEmail = req.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (user) {
      return res.json({
        status: "error",
        error: "user have already register ",
      });
    } else if (userNumber.length != 10) {
      return res.json({
        status: "error",
        error: "Invalid user number ",
      });
    } else if (!emailRegex.test(userEmail)) {
      return res.json({
        status: "error",
        error: "Invalid email address ",
      });
    } else if (password.length < 8) {
      return res.json({
        status: "error",
        error: "password minimum 8 chracter ! ",
      });
    } else {
      user = await User.create(req.body);
      if (user) {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "sparklight2564@gmail.com",
            pass: "vmwkioxwjbjfqkbd",
          },
        });

        var mailOptions = {
          from: "sparklight2564@gmail.com",
          to: req.body.email,
          subject: "Your Account register succesfully ",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
      return res.json({ status: httpStatus.CREATED, userId: user });
    }
  } catch (err) {
    return res.send(err.message);
  }
};

exports.getAdminData = async (req, res) => {
  // const id = req.params.id


  try {
    const testDatas = await Custumer.aggregate([
        {
          $match: {
            owner_id: {
              $in: ["651030bdcb9274e131c0bc78", "651030fbcb9274e131c0bc7e"]
            }
          }
        },


        {
          $group: {
            _id: "$owner_id",
            totalAmount: { $sum: { $toInt: "$custumerAmount" } },
            walkin: { $sum: 1 },
          }
        },

        {
          $project: {
            owner_id: "$_id",
            totalAmount: 1,
            walkin:1,
            _id: 0
          }
        }
    ]);


    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    const CurrentMonthRevenue = await Custumer.aggregate([
      {
        $match: {
          owner_id: {
            $in: ["651030bdcb9274e131c0bc78", "651030fbcb9274e131c0bc7e"],
          },
          createdAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$owner_id",
          totalAmount: { $sum: { $toInt: "$custumerAmount" } },
          walkinMonth: { $sum: 1 },

        },
      },

      
    ]);


    const totalMonthRavenue = CurrentMonthRevenue.reduce(
      (total , item) => total + item.totalAmount,
      0,
    );

    const walkinMonth = CurrentMonthRevenue.reduce(
      (total , item) => total + item.walkinMonth,
      0,
    );

    const totalRavenue = testDatas.reduce(
      (total , item) => total + item.totalAmount,
      0,
    );

    const totalwalkin = testDatas.reduce(
      (total , item) => total + item.walkin,
      0,
    );


    return res.send([{
      totalMonthRavenue,
      totalRavenue,
      walkinMonth,
      totalwalkin,

      testDatas
    }]);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


exports.get = async (req, res) => {
  try {
    const user = await User.find()
    return res.send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


exports.update =  async (req, res) => {
  try{
    const user = await User.findByIdAndUpdate(req.body._id,
      { $set: { ActiveStatus: req.body.ActiveStatus }},
      {new:true})
    res.send(user)
  }
  catch(err){
    res.send(err.message);
  }
};