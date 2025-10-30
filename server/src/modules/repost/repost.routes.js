const express = require("express");
const passport = require("passport");
const router = express.Router();
const repostController = require("./repost.controller");

const requireAuth = passport.authenticate("jwt", { session: false });

// Create a repost
router.post("/", requireAuth, repostController.createRepost);

// Get reposts by user
router.get("/user/:userId", repostController.getUserReposts);

// Get reposts for a thread
router.get("/thread/:threadId", repostController.getThreadReposts);

// Delete a repost
router.delete("/:id", requireAuth, repostController.deleteRepost);

module.exports = router;
