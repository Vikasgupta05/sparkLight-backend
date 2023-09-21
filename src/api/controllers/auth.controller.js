require("dotenv").config();
const User = require("../models/client.model");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const jwtToken = require("../utils/token");
const nodemailer = require("nodemailer");

exports.register = async (req, res, next) => {

  try {
    let user = await User.findOne({ email: req.body.email });
    let saloonNumber = await User.findOne({ saloonNumber: req.body.saloonNumber });
    let password = req.body.password;
    let userNumber = req.body.userNumber;
    let userEmail = req.body.email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (user) {
      return res.json({
        status: "error",
        error: "user have already register ",
      });
    }
    else if (userNumber.length != 10) {
      return res.json({
        status: "error",
        error: "Invalid user number ",
      });
    } 
    else if(!emailRegex.test(userEmail)) {
      return res.json({
        status: "error",
        error: "Invalid email address ",
      });
    } 
    else if(!saloonNumber) {
      return res.json({
        status: "error",
        error: "Invalid saloon owner number ",
      });
    } else if (password.length < 8) {
      return res.json({
        status: "error",
        error: "password minimum 8 chracter ! ",
      });
    } 
    else {
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

exports.login = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ status: "error", error: "Invalid password or email" });
    } 
    else if (user.role !== req.body.role) {
      return res.json({ status: "error", error: `Please go with ${user.role} login` });
    }
    else {
      const match = user.checkPassword(req.body.password);
      if (!match) {
        return res.json({
          status: "error",
          error: "Invalid password or email",
        });
      }
      const token = jwtToken.createJwtToken(user);
      return res.json({ status: httpStatus.OK, token: token , user :user.userName , role : user.role});
    }
  } catch (err) {
    return res.send(err.message);
  }
};
