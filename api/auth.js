const express = require("express");
const authController = require("../controllers/auth.controller");
const authRouter = express.Router();

authRouter.post("/auth/register", authController.registerUser);

module.exports = authRouter;
