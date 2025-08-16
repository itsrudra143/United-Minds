const express = require("express");
const passport = require("passport");
const router = express.Router();
const ctrl = require("./reply.controller");

const requireAuth = passport.authenticate("jwt", { session: false });
router.post("/", requireAuth, ctrl.createReply);
router.get("/thread/:threadId", ctrl.getThreadReplies);
router.get("/:id", ctrl.getReplyById);

module.exports = router;
