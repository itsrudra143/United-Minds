const express = require("express");
const router = express.Router();
const { register, login, me } = require("./auth.controller");
const passport = require("passport");
require("./auth.middleware")(); 

router.post("/register", register);
router.post("/login", login);
router.get("/me", passport.authenticate("jwt", { session: false }), me);

module.exports = router;
