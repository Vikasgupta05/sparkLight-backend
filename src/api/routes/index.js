const express = require("express");
const authRoutes = require("./auth.route");
const custumerRoutes = require("./custumer.route");
const custumerServiceRoutes = require("./custumerService.route");
const staffRoutes = require("./staff.route");
const serviceRoutes = require("./service.route");
const productRoutes = require("./product.route");
const notificationRoutes = require("./notification.route");



const router = express.Router();


router.use("/auth", authRoutes);
router.use("/custumer", custumerRoutes);
router.use("/custumer-service", custumerServiceRoutes);
router.use("/staff", staffRoutes);
router.use("/serivce", serviceRoutes);
router.use("/product", productRoutes);
router.use("/notification", notificationRoutes);










module.exports = router;
