import { Router } from "express";
import { registerUser, logInUser, getProfile, getUser, updateUser, changePassword, resetPassword, updatePassword, verifyEmail } from "../controllers/auth.controller.js";
import { auth } from '../middlewares/auth.js'

const authRouter = Router();

authRouter.post("/auth/register", registerUser);
authRouter.post("/auth/login", logInUser);
authRouter.get('/user/me', auth, getProfile)
authRouter.get('/user/:slug', getUser)
authRouter.put('/user/:slug/settings', auth, updateUser)
authRouter.put('/user/:slug/changePassword', auth, changePassword)
authRouter.post('/resetPassword', resetPassword)
authRouter.get('/updatePassword', verifyEmail)
authRouter.post('/updatePassword', updatePassword)

export default authRouter;
