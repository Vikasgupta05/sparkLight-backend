const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();

router.route("/add").post(productController.create);
router.route("/get").get(productController.get);


module.exports = router;
