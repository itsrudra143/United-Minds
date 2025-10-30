const express = require("express");
const passport = require("passport");
const router = express.Router();
const followController = require("./follow.controller");

const requireAuth = passport.authenticate("jwt", { session: false });

// Follow a user
router.post("/", requireAuth, followController.followUser);

// Unfollow a user
router.delete("/:followingId", requireAuth, followController.unfollowUser);

// Get followers of a user
router.get("/:userId/followers", followController.getUserFollowers);

// Get users that a user is following
router.get("/:userId/following", followController.getUserFollowing);

// Check if user is following another user
router.get(
  "/:targetUserId/check",
  requireAuth,
  followController.checkFollowing
);

module.exports = router;
