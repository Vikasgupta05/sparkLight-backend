const express = require("express");
const notificationController = require("../controllers/notification.controller");
const router = express.Router();

router.route("/add").post(notificationController.create);
router.route("/get/:id").get(notificationController.get);
router.route("/update").put(notificationController.update);
router.route("/delete/:id").delete(notificationController.delete);



module.exports = router;
