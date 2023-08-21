const User = require("../models/client.model");

const {
  AUTH_TOKEN_MISSING_ERR,
  AUTH_HEADER_MISSING_ERR,
  JWT_DECODE_ERR,
  USER_NOT_FOUND_ERR,
} = require("../utils/error/errors");

const { verifyJwtToken } = require("../utils/token");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    // console.log("header", header);
    if (!header) {
      next({
        status: 200,
        authRequired: true,
        message: AUTH_HEADER_MISSING_ERR,
      });
      return;
    }
    const token = header.split("Bearer ")[1];
    if (!token) {
      next({
        status: 404,
        authRequired: true,
        message: AUTH_TOKEN_MISSING_ERR,
      });
      return;
    }
    const { user } = verifyJwtToken(token, next);
    const userId = user._id;

    if (!userId) {
      next({ status: 404, authRequired: true, message: JWT_DECODE_ERR });
      return;
    } else {
      req.user = userId;
      next();
    }
  } catch (err) {
    next(err);
  }
};
