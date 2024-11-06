"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endGame = async (roomCode, socket, io) => {
    try {
        if (!socket.gameState.gameIsActive) {
            return;
        }
        const message = 'The game has ended.';
        console.log(message);
        const sockets = await io.in(roomCode).fetchSockets();
        sockets.map((cur) => {
            cur.gameState = {
                ...cur.gameState,
                gameIsActive: false,
                activeUsers: [],
                activeCards: [],
                messages: [...cur.gameState.messages, { sender: null, content: message }]
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    }
    catch (err) {
        console.log('error ending game in room ' + roomCode + ': ' + err);
    }
};
exports.default = endGame;
//# sourceMappingURL=endGame.js.map