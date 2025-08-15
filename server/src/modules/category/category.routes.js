const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");

// POST /api/categories
router.post("/", categoryController.createCategory);

// GET /api/categories
router.get("/", categoryController.getCategories);

module.exports = router;
