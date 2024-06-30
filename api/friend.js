import { Router } from "express";
import { addFriend, requestFriend, getFriend, unFriend } from "../controllers/friend.controller.js";
import { auth } from '../middlewares/auth.js'

const friendRouter = Router();

friendRouter.post("/sendRequestFriend", auth, addFriend);
friendRouter.get("/friends/requests", auth, requestFriend);
friendRouter.get("/friends", auth, getFriend);
friendRouter.delete("/friends/:id", auth, unFriend);

export default friendRouter;
