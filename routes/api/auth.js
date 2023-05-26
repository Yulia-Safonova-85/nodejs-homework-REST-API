const express = require("express");
const ctrl = require("../../controllers/auth-controller");
const router = express.Router();

const {validateData} = require("../../decorators");
const {schemas} = require("../../models/user");

router.post("/register", validateData(schemas.registerSchema), ctrl.register);

router.post("/login", validateData(schemas.loginSchema), ctrl.login)

module.exports = router;