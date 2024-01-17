const express = require("express");
const router = express.Router();
const CustomerController = require("../controller/Customer");

router.get("/list-chat", CustomerController.list_chat);
router.post("/send-chat", CustomerController.send_chat);

router.get('/cart', CustomerController.get_cart)
router.post('/cart/delete',CustomerController.delete_cart)
router.post('/cart/decrease',CustomerController.decrease_cart)
router.post('/cart/add',CustomerController.add_to_cart)
router.get('/transaction', CustomerController.getTransaction)
module.exports = router;
