const express = require("express");
const passport = require("passport");
const router = express.Router();
const voteController = require("./vote.controller");

const requireAuth = passport.authenticate("jwt", { session: false });

router.post("/threads/:id/votes", requireAuth, voteController.voteThread);
router.post("/replies/:id/votes", requireAuth, voteController.voteReply);

module.exports = router;
