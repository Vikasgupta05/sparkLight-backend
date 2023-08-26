const express = require("express");
const custumerController = require("../controllers/custumer.controller");
const router = express.Router();

router.route("/add").post(custumerController.create);
router.route("/get").get(custumerController.get);


module.exports = router;
