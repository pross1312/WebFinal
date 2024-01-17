const db = require('../module/database');
const ProductModel = require("./Product.model");


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
    
    async getAllTransaction() {
        const result = await db.exec(
            "manyOrNone",
            `SELECT tr.* FROM "Transaction" tr`
        );
        if (!result) throw new CustomError( `Cant select data from "Transaction"`, 400, "");
        return result;
    }
};
