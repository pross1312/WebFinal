const AccountModel = require("../model/Account.model");
const SocketModel = require("../model/Socket.model");
const handler = {
    "/chat": async (socket, req) => {
        const user = req.user;
        const acc = await AccountModel.get(user);
        socket.onclose = () => {
            if (acc.type === "customer") {
                const admin_sock = SocketModel.get("admin");
                if (admin_sock !== undefined) {
                    admin_sock.send("[LOGOUT] " + user);
                }
            }
            SocketModel.remove(user);
        }
        if (acc.type === "admin") {
            SocketModel.put("admin", socket);
        } else {
            SocketModel.put(user, socket);
            const admin_sock = SocketModel.get("admin");
            if (admin_sock !== undefined) {
                admin_sock.send("[LOGIN] " + user);
            }
        }
    }
};


module.exports = (socket, req) => {
    const path = req.url?.toString();
    if (path in handler) {
        handler[req.url?.toString()](socket, req);
    } else {
        socket.send(new Error(`Unregconized path ${path}`));
        socket.close();
    }
};
