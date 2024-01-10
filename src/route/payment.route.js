const express = require("express");
const router = express.Router();
const PaymentController = require("../controller/Payment");

router.get("/login", (req, res, next) => {
    res.render("payment/login", {error: null});
});
router.post("/login", PaymentController.login);
router.get("/google", (req, res, next) => {
    res.render("payment/login", {error: null});
});
router.post("/create-order", (req, res, next) => {
    console.log("TOKEN:", req.session.payment_access_token || "");
    req.session.payment_access_token = undefined;
    res.redirect("/");
});

module.exports = router;
