"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendEventChatMessage = async (roomCode, message, socket, io) => {
    try {
        console.log('event message "' + message + '" sent in room ' + roomCode);
        const sockets = await io.in(roomCode).fetchSockets();
        sockets.map((cur) => {
            cur.gameState = {
                ...cur.gameState,
                messages: [...cur.gameState.messages, { sender: null, content: message }]
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    }
    catch (err) {
        console.log('error sending event chat message in ' + roomCode + ': ' + err);
    }
};
exports.default = sendEventChatMessage;
//# sourceMappingURL=sendEventChatMessage.js.map