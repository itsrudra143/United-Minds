const express = require("express");
const passport = require("passport");
const router = express.Router();
const threadController = require("./thread.controller");

const requireAuth = passport.authenticate("jwt", { session: false });
router.post("/", requireAuth, threadController.createThread);
router.get("/", threadController.getThreads);
router.get("/:id", threadController.getThreadById);



module.exports = router;