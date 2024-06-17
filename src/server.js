const route = require("../api/route");
const bodyParser = require("body-parser");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("dotenv").config();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port  ${port} : http://localhost:${port}`);
});
route(app);
