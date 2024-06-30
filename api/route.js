import authRouter from "./auth.js";
import friendRouter from "./friend.js";
import followRouter from "./follow.js";
export default function route(app) {
  app.use("/api/v1", authRouter);
  app.use("/api/v1", friendRouter);
  app.use("/api/v1", followRouter);

}
