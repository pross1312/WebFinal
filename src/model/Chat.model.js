const db = require("../module/database");
module.exports = {
    ChatMessage: class {
        constructor({ role, content, email }) {
            this.role = role;
            this.content = content;
            this.email = email;
        }
    },
    async add(chat) {
        if (
            (Array.isArray(chat) &&
                chat.length == 0 &&
                !(chat[0] instanceof this.ChatMessage)) ||
            !(chat instanceof this.ChatMessage)
        ) {
            throw new Error("Invalid arguments type");
        }
        await db.add("ChatMessage", ["role", "content", "email"], chat);
    },
    async list(email) {
        if (email) {
            const result = await db.exec(
                "manyOrNone",
                `SELECT * FROM "ChatMessage" WHERE email = $1`,
                email
            );
            return result;
        } else throw new Error("Missing arguments");
    },
    async delete(email){ 
        if (email) {
            const result = await db.exec(
                "any",
                `DELETE FROM "ChatMessage" WHERE email = $1`,
                email
            );
            return result;
        } else throw new Error("Missing arguments");
    }
};

