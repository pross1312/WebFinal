const db = require("../module/database");

module.exports = {
    UserInfo: class {
        constructor({email, name, avatar}) {
            this.email = email;
            this.name = name;
            this.avatar = avatar;
        }
    },
    async add(userinfo) {
        if ((Array.isArray(userinfo) && userinfo.length == 0 && !(userinfo[0] instanceof this.UserInfo)) ||
            (!(userinfo instanceof this.UserInfo))) {
            throw new Error("Invalid arguments type");
        }
        await db.add("UserInfo", Object.keys(userinfo), userinfo);
    },
    async get(email) {
        if (email) {
            const result = await db.exec("one", `SELECT * FROM "UserInfo" WHERE email = '${email}'`);
            return result ? new this.UserInfo(result) : null;
        } else throw new Error("Missing arguments");
    }
};

