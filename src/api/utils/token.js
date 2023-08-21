const jwt = require("jsonwebtoken");

exports.createJwtToken = (user) => {
  return jwt.sign({ user }, "Stack", {
    expiresIn: "60d",
  });
};

exports.verifyJwtToken = (token, next) => {
  try {
    const user = jwt.verify(token, "Stack");
    return user;
  } catch (err) {
    next(err);
  }
};
