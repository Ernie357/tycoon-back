"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaultGameState_1 = __importDefault(require("../gameMutators/defaultGameState"));
const reconnect = async (gameState, playerName, socket, io) => {
    try {
        const sockets = await io.in(gameState.roomCode).fetchSockets();
        const prevUser = gameState.users.reduce((acc, cur) => {
            return playerName === cur.name ? cur : acc;
        }, null);
        socket.roomCode = gameState.roomCode;
        socket.user = prevUser;
        socket.join(gameState.roomCode);
        const newActiveUsers = gameState.gameIsActive ? [...gameState.activeUsers, prevUser] : [];
        const message = `${playerName} reconnected.`;
        let prevMessages = sockets[0] && sockets[0].gameState && sockets[0].gameState.messages && sockets[0].gameState.messages.length > 0 ? sockets[0].gameState.messages : [];
        prevMessages = [...prevMessages, { sender: null, content: message }];
        io.to(gameState.roomCode).emit('update game state', socket.gameState);
        sockets.forEach((cur) => {
            cur.gameState = {
                ...cur.gameState,
                users: [...gameState.users, prevUser],
                activeUsers: newActiveUsers,
                messages: prevMessages
            };
        });
        socket.gameState = sockets[0] ? sockets[0].gameState : defaultGameState_1.default;
        console.log(message);
    }
    catch (err) {
        console.log('error reconnecting to room: ' + err);
    }
};
exports.default = reconnect;
//# sourceMappingURL=reconnect.js.map