const express = require("express");
const router = express.Router();
const tagController = require("./tag.controller");

// POST /api/tags
router.post("/", tagController.createTag);

// GET /api/tags
router.get("/", tagController.getTags);

module.exports = router;
