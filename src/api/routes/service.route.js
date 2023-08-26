const express = require("express");
const serviceController = require("../controllers/service.controller");
const router = express.Router();

router.route("/add").post(serviceController.create);
router.route("/get").get(serviceController.get);


module.exports = router;
