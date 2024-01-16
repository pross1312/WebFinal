const chat_sockets = {}; // database
module.exports = {
    put(email, socket) {
        if (chat_sockets[email] !== undefined) {
            chat_sockets[email].close();
            delete chat_sockets[email];
        }
        chat_sockets[email] = socket;
    },
    get(email) {
        return chat_sockets[email];
    },
    send(email, content) {
        chat_sockets[email].send(content);
    },
    remove(email) {
        delete chat_sockets[email];
    }
};
