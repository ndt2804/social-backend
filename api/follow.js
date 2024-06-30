import { Router } from "express";
import { auth } from '../middlewares/auth.js'
import { followUser } from "../controllers/follow.controller.js";
const followRouter = Router();

followRouter.post("/follow", auth, followUser);


export default followRouter;
