require("dotenv").config();
const User = require("../models/client.model");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const jwtToken = require("../utils/token");
const nodemailer = require("nodemailer");

exports.register = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    let password = req.body.password;

    if (user) {
      return res.json({
        status: "error",
        error: "user have already register ",
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

exports.login = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ status: "error", error: "Invalid password or email" });
    } else {
      const match = user.checkPassword(req.body.password);
      if (!match) {
        return res.json({
          status: "error",
          error: "Invalid password or email",
        });
      }
      const token = jwtToken.createJwtToken(user);
      return res.json({ status: httpStatus.OK, token: token });
    }
  } catch (err) {
    return res.send(err.message);
  }
};
