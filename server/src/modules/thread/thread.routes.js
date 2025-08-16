const express = require("express");
const passport = require("passport");
const router = express.Router();
const threadController = require("./thread.controller");

const requireAuth = passport.authenticate("jwt", { session: false });

// POST /api/threads
router.post("/", requireAuth, threadController.createThread);

// GET /api/threads
router.get("/", threadController.getThreads);

// GET /api/threads/:id
router.get("/:id", threadController.getThreadById);

// POST /api/threads/:id/votes
router.post("/:id/votes", requireAuth, threadController.voteThread);

module.exports = router;