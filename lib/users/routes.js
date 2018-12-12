var express = require("express");
router = express.Router();
var controller = require("./controller.js");
router.post("/googleauth", controller.post.GoogleAuth);
router.get("/me", controller.get.me);
//router.put("/", controller.put.industries);
//router.delete("/:id", controller.delete.industry);

module.exports = router;
