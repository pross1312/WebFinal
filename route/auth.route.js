const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post("/login", passport.authenticate("local", {
    failureMessage: true,
    failureRedirect: "/auth/login",
}), (req, res) => {
    console.log(req.user);
    if (req.body.remember) {
        req.session.cookie.maxAge = 10 * 60 * 1000; // 10mins
    } else {
        req.session.cookie.expires = null;
    }
    res.redirect("/");
});

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
    res.status(200).send("OK");
});

router.get("/login", (req, res) => {
    if (!req.isAuthenticated()) {
        const error = req.session?.messages?.pop();
        res.render("login", {error});
    } else {
        res.redirect("/");
    }
});

module.exports = router;
