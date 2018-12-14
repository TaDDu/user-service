require("dotenv").config();
const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("./config/config.json");
var appInfo = require("./package.json");
const eStatics = require("e-statics")(app);

app.use(bodyParser.json());
app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms"
  )
);
app.use(eStatics.counter);

app.use("/api", require("./lib"));

const port = process.env.PORT || config.port || 8080;
app.listen(port, () => {
  console.log("Listening to port: %i", port);
});
