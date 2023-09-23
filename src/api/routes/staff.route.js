const express = require("express");
const staffController = require("../controllers/staff.controller");
const router = express.Router();

router.route("/add").post(staffController.create);
router.route("/get").get(staffController.get);
router.route("/update").put(staffController.update);
router.route("/delete").delete(staffController.delete);





module.exports = router;
