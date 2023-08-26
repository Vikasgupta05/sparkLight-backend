const express = require("express");
const custumerServiceController = require("../controllers/custumerService.controller");
const router = express.Router();

router.route("/add").post(custumerServiceController.create);
router.route("/get").get(custumerServiceController.get);
router.route("/serviceType").post(custumerServiceController.post);


module.exports = router;
