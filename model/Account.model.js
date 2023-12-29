const db = require("../module/database");
module.exports = {
    Account: class {
        constructor({email, password}) {
            this.email = email;
            this.password = password;
        }
    },
    async add(account) {
        if ((Array.isArray(account) && account.length == 0 && !(account[0] instanceof this.Account)) ||
            (!(account instanceof this.Account))) {
            throw new Error("Invalid arguments type");
        }
        await db.add("Account", ["email", "password"], account);
    },
    async get(email) {
        if (email) {
            const result = await db.exec("one", `SELECT * FROM "Account" WHERE email = '${email}'`);
            return result ? new this.Account(result) : null;
        } else throw new Error("Missing arguments");
    }
};
