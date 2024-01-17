const db = require('../module/database');
const ProductModel = require("./Product.model");
const payment_req = require("../module/payment_req");


module.exports = {
    Transaction: class {
        constructor({ id, initiator, receiver, ts, amount, description }) {
            this.id = id;
            this.ts = ts;
            this.receiver = receiver;
            this.initiator = initiator;
            this.description = description;
            this.amount = amount;
        }
    },
};
