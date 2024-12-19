const express = require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(savRedirectUrl, passport.authenticate("local",{ failureRedirect: "/login", failureFlash : true}) ,userController.verification);

//logout route
router.get("/logout",userController.logout);

module.exports = router;