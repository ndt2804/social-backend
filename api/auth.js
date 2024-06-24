import { Router } from "express";
import { registerUser, logInUser, getProfile, getUser } from "../controllers/auth.controller.js";
import { auth } from '../middlewares/auth.js'

const authRouter = Router();

authRouter.post("/auth/register", registerUser);
authRouter.post("/auth/login", logInUser);
authRouter.get('/user/me', auth, getProfile)
authRouter.get('/user/:slug', getUser)

export default authRouter;
