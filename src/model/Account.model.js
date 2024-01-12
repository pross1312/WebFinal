const db = require("../module/database");
module.exports = {
    Account: class {
        constructor({ email, password, type = "customer"}) {
            this.email = email;
            this.password = password;
            this.type = type.toLowerCase();
        }
    },
    async add(account) {
        if (
            (Array.isArray(account) &&
                account.length == 0 &&
                !(account[0] instanceof this.Account)) ||
            !(account instanceof this.Account)
        ) {
            throw new Error("Invalid arguments type");
        }
        try {
            await db.add("Account", ["email", "password", "type"], account);
        } catch (err) {
            next(err);
        }
    },
    async get(email) {
        try {
            if (email) {
                const result = await db.exec(
                    "one",
                    `SELECT * FROM "Account" WHERE email = '${email}'`
                );
                return result ? new this.Account(result) : null;
            } else throw new Error("Missing arguments");
        } catch (err) {
            throw(err)
        }
    },
};
