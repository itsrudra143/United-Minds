const express = require("express");
const passport = require("passport");
const router = express.Router();
const voteController = require("./vote.controller");

const requireAuth = passport.authenticate("jwt", { session: false });

// Original endpoints (kept for backward compatibility)
router.post("/thread/:id", requireAuth, voteController.voteThread);
router.post("/reply/:id", requireAuth, voteController.voteReply);

// New dedicated upvote/downvote endpoints for threads
router.post("/thread/:id/upvote", requireAuth, voteController.upvoteThread);
router.post("/thread/:id/downvote", requireAuth, voteController.downvoteThread);

// New dedicated upvote/downvote endpoints for replies
router.post("/reply/:id/upvote", requireAuth, voteController.upvoteReply);
router.post("/reply/:id/downvote", requireAuth, voteController.downvoteReply);

module.exports = router;
