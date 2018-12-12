require("dotenv").config();
const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require("http");
const config = require("./config/config.json");
var appInfo = require("./package.json");
let statics = {
  GET: 0,
  POST: 0,
  PUT: 0,
  DELETE: 0,
  TOTAL: 0
};
app.use(bodyParser.json());
app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms"
  )
);
app.use(function(req, res, next) {
  statics[req.method]++;
  statics.TOTAL++;
  next();
});

app.use("/api", require("./lib"));
app.get("/statics", (req, res) => {
  var data = {
    statics: statics,
    name: appInfo.name,
    version: appInfo.version
  };
  res.json(data);
});

const port = process.env.PORT || config.port || 8080;
const server = http.createServer(app).listen(port);
console.log("SERVER STARTED AT PORT: %i", port);
