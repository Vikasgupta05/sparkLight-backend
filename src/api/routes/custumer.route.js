const express = require("express");
const custumerController = require("../controllers/custumer.controller");
const router = express.Router();

router.route("/add").post(custumerController.create);
router.route("/get").get(custumerController.get);
router.route("/staff-detail").get(custumerController.getStaff);
router.route("/service-count").get(custumerController.getServiceCount);



module.exports = router;
