var express = require("express");
var app = express();
var routes = require("./routes.js");

app.use("/users", routes);

module.exports = app;
