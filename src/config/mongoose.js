const mongoose = require("mongoose");
const { MONGO_URL } = require("./vars");
mongoose.Promise = Promise;

module.exports = () => {
  return mongoose.connect(
    process.env.MONGO_URL ||
      "mongodb+srv://sparklight:sparklight123@sparklight.gm8xbvt.mongodb.net/sparklight?retryWrites=true&w=majority",
      // "mongodb+srv://vikas:vikas_123@cluster0.aflw8.mongodb.net/sparklight?retryWrites=true&w=majority",
    );
};

