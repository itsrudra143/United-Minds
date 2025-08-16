const express = require("express");
const passport = require("passport");
const router = express.Router();
const ctrl = require("./reply.controller");

const requireAuth = passport.authenticate("jwt", { session: false });

// Create a reply (auth required)
router.post("/", requireAuth, ctrl.createReply);

// List replies for a thread (top-level by default, or ?parent_id=123)
router.get("/thread/:threadId", ctrl.getThreadReplies);

// Get a reply by id
router.get("/:id", ctrl.getReplyById);

module.exports = router;

