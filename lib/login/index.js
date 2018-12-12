var express = require("express");
var app = express();
var routes = require("./routes.js");

app.use("/login", routes);

module.exports = app;
