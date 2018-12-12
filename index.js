require("dotenv").config();
const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require("http");
const config = require("./config/config.json");

app.use(bodyParser.json());
app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms"
  )
);

app.use("/api", require("./lib/users"));

const port = process.env.PORT || config.port || 8080;
const server = http.createServer(app).listen(port);
console.log("SERVER STARTED AT PORT: %i", port);
