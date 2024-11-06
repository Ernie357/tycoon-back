"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendChatMessage = async (roomCode, sender, message, socket, io) => {
    try {
        console.log(sender.name + ' sent "' + message + '" in room ' + roomCode);
        const sockets = await io.in(roomCode).fetchSockets();
        sockets.map((cur) => {
            cur.gameState = {
                ...cur.gameState,
                messages: [...cur.gameState.messages, { sender: sender, content: message }]
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    }
    catch (err) {
        console.log('error sending chat message in ' + roomCode + ': ' + err);
    }
};
exports.default = sendChatMessage;
//# sourceMappingURL=sendChatMessage.js.map