const express = require("express");
const router = express.Router();
const PaymentController = require("../controller/Payment");
const CartModel = require("../model/Cart.model");
const CustomError = require("../module/CustomErr");

router.get("/create-order", (req, res, next) => {
    if (req.session.payment_access_token === undefined) {
        res.render("payment/login", {error: null, email: req.user?.email});
    } else {
        PaymentController.create_order(req, res, next);
    }
});
router.get("/register", (req, res, next) => {
    res.render("payment/register", {error: null, email: req.user?.email});
});
router.post("/register", PaymentController.register);
router.post("/login", PaymentController.login);
router.get("/confirm-transaction", PaymentController.confirm_transaction);
router.get("/cancel-transaction", PaymentController.cancel_transaction);
router.use((req, res, next) => { // NOTE: after login, access token must exist in session
    if (req.session.payment_access_token === undefined) {
        next(new CustomError("Missing access token", 400));
    } else {
        next();
    }
});
router.post("/create-order", PaymentController.create_order);
router.get("/confirm-order", PaymentController.confirm_order);
router.get("/cancel-order", PaymentController.cancel_order);

module.exports = router;
