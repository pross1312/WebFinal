const express = require("express");
const router = express.Router();
const CustomerController = require("../controller/Customer");

router.get("/list-chat", CustomerController.list_chat);
router.post("/send-chat", CustomerController.send_chat);

module.exports = router;
