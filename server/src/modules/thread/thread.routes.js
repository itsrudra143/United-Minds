const express = require("express");
const router = express.Router();
const threadController = require("./thread.controller");

// POST /api/threads
router.post("/", threadController.createThread);

// GET /api/threads
router.get("/", threadController.getThreads);

// GET /api/threads/:id
router.get("/:id", threadController.getThreadById);

module.exports = router;
