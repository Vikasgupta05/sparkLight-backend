var cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connect = require("./config/mongoose");
const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

mongoose.set("strictQuery", false);
app.use(express.json());
const indexRouter = require("./api/routes/index");
const { ValidationError } = require("express-validation");

app.use("/", indexRouter);
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  try {
    connect();
  } catch (err) {
    console.error(err.message);
  }
  console.log(`server started on port ${PORT}`);
});
