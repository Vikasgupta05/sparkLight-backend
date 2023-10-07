const express = require("express");
const custumerController = require("../controllers/custumer.controller");
const router = express.Router();

router.route("/add").post(custumerController.create);
router.route("/update").put(custumerController.update);

router.route("/get/:id").get(custumerController.get);
router.route("/staff-detail").post(custumerController.getStaff);
router.route("/service-count").get(custumerController.getServiceCount);
router.route("/pay").post(custumerController.razerpay);
router.route("/staff-service-detail").post(custumerController.getStaffWithDetails);

router.route("/delete/:id").delete(custumerController.delete);





module.exports = router;
