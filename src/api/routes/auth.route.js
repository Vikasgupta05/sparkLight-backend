const express = require("express");
const { validate } = require("express-validation");
const controller = require("../controllers/auth.controller");
const { login, register } = require("../validations/auth.validation");

const router = express.Router();



router.route("/get").get(controller.get);
router.route("/login").post(validate(login, {}, {}), controller.login);
router.route("/register").post(validate(register, {}, {}), controller.register);
router.route("/owner-register").post(validate(register, {}, {}), controller.ownerRegister);
router.route("/admin-register").post(validate(register, {}, {}), controller.adminRegister);



module.exports = router;
