const express = require("express");
const passport = require("passport");
const router = express.Router();
const voteController = require("./vote.controller");

const requireAuth = passport.authenticate("jwt", { session: false });

// 🟢 Thread votes
// Example: POST /api/vote/threads/1/votes
router.post("/threads/:id/votes", requireAuth, voteController.voteThread);

// 🟢 Reply votes
// Example: POST /api/vote/replies/5/votes
router.post("/replies/:id/votes", requireAuth, voteController.voteReply);

module.exports = router;
