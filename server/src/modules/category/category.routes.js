const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getCategories);

module.exports = router;
