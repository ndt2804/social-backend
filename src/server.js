import route from "../api/route.js";
import bodyParser from "body-parser";

import express from "express";
const app = express();
app.use(express.json());
app.use(express({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
import "dotenv/config";
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port  ${port} : http://localhost:${port}`);
});
route(app);
