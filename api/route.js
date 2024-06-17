const authRouter = require("./auth");
function route(app) {
  app.use("/api/v1", authRouter);
}
module.exports = route;
