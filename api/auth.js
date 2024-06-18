const express = require("express");
const authController = require("../controllers/auth.controller");
const authRouter = express.Router();

authRouter.post("/auth/register", authController.registerUser);
authRouter.post("/auth/login", authController.logInUser);

module.exports = authRouter;
