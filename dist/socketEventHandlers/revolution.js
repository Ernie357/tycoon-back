"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const revolution = async (roomCode, socket, io) => {
    try {
        const message = `${socket.user.name} started a revolution!`;
        console.log(message);
        const sockets = await io.in(roomCode).fetchSockets();
        sockets.map((cur) => {
            cur.gameState = {
                ...cur.gameState,
                revolution: !cur.gameState.revolution,
                messages: [...cur.gameState.messages, { sender: null, content: message }]
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    }
    catch (err) {
        console.log('error starting a revolution in room ' + roomCode + ': ' + err);
    }
};
exports.default = revolution;
//# sourceMappingURL=revolution.js.map