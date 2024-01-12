const express = require("express");
const router = express.Router();
const PaymentController = require("../controller/Payment");

router.get("/create-order", (req, res, next) => {
    res.render("payment/create-order", {
        error: null,
        cart: JSON.stringify([
            {id: 1, count: 5},
            {id: 2, count: 6},
            {id: 3, count: 8},
            {id: 7, count: 5},
            {id: 9, count: 5},
            {id: 11, count: 5},
            {id: 12, count: 5},
            {id: 13, count: 5},
            {id: 15, count: 50},
            {id: 18, count: 5},
            {id: 19, count: 5},
        ])
    });
});
router.post("/login", PaymentController.login);
router.get("/google", (req, res, next) => { // TODO:
    res.render("payment/login", {error: null});
});
router.use((req, res, next) => { // NOTE: after login, access token must exist in session
    if (req.session.payment_access_token === undefined) {
        res.status(400).send("Missing access token");
    } else {
        next();
    }
});
router.post("/create-order", PaymentController.create_order);
router.get("/confirm-order", PaymentController.confirm_order);
router.get("/confirm-transaction", PaymentController.confirm_transaction);

module.exports = router;
