const ChatModel = require("../model/Chat.model");
const SocketModel = require("../model/Socket.model");
const active_customers = {};

module.exports = {
    async list_chat(req, res, next) {
        try {
            const chat = await ChatModel.list(req.user?.email);
            res.status(200).setHeader("Content-Type", "application/json")
                           .send(JSON.stringify(chat));
        } catch(err) {
            next(err);
        }
    },
    async send_chat(req, res, next) {
        const {content} = req.body;
        if (content === undefined) {
            res.status(400).send("Missing content");
        } else try {
            await ChatModel.add(new ChatModel.ChatMessage({role: "customer", content, email: req.user?.email}));
            SocketModel.send("admin", `[MSG] [${req.user?.email}]${content}`);
            res.status(200).send("OK");
        } catch(err) {
            next(err);
        }
    },
};
