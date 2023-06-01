const express = require("express");

const ctrl = require("../../controllers/auth-controller");

const authenticate = require ("../../middlewares/authenticate");

const {validateData} = require("../../decorators");

const {schemas} = require("../../models/user");

const router = express.Router();
require("dotenv").config();

router.post("/register", validateData(schemas.registerSchema), ctrl.register);

router.post("/login", validateData(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;