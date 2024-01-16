const chat_sockets = {};

const handler = {
    "/chat": (socket, req) => {
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
