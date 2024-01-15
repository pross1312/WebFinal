const express = require("express");
const passport = require("passport");
const AccountController = require('../controller/Account.js');
const CartModel = require("../model/Cart.model.js");
const router = express.Router();

router.post(
    "/login",
    passport.authenticate("local", {
        failureMessage: true,
        failureRedirect: "/auth/login",
    }),
    async (req, res) => {
        try { // NOTE: test data
            for (let i = 15; i < 20; i++) {
                await CartModel.add(req.user?.email, i, 5);
            }
        } catch(err) { }
        if (req.body.remember) {
            req.session.cookie.maxAge = 10 * 60 * 1000; // 10mins
        } else {
            req.session.cookie.expires = null;
        }
        res.redirect("/");
    }
);

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get("/google/callback", (req, res, next) => {
    req._response = res; // HACK: pass response to render data in case of failure cause i have to idea how to use failure redirect
    next()
}, passport.authenticate("google"), async (req, res) => {
    try { // NOTE: test data
        for (let i = 15; i < 20; i++) {
            await CartModel.add(req.user?.email, i, 5);
        }
    } catch(err) {}
    res.redirect("/");
});


router.get("/login", (req, res) => {
    const error = req.session?.messages?.pop();
    res.render("login", { error });
});

router.get("/register", (req, res) => {
    res.render("register", { error: "" });
});

router.post("/register", AccountController.register);
router.post("/verify-register", AccountController.verify);

module.exports = router;
