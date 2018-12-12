var express = require("express");
router = express.Router();
var controller = require("./controller.js");
router.get("/me", controller.get.me);
router.get("/me/meta", controller.get.meta);
router.post("/me/meta", controller.post.meta);
//router.put("/", controller.put.industries);
//router.delete("/:id", controller.delete.industry);

module.exports = router;
