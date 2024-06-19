import { Router } from "express";
import { registerUser, logInUser } from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter.post("/auth/register", registerUser);
authRouter.post("/auth/login", logInUser);

export default authRouter;
