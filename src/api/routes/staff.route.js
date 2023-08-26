const express = require("express");
const staffController = require("../controllers/staff.controller");
const router = express.Router();

router.route("/add").post(staffController.create);
router.route("/get").get(staffController.get);



module.exports = router;
