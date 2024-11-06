"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaultGameState_1 = __importDefault(require("../gameMutators/defaultGameState"));
const refreshUsers_1 = __importDefault(require("../gameMutators/refreshUsers"));
const join = async (roomCode, newPlayerName, newPlayerImage, socket, io) => {
    try {
        if (newPlayerName === '') {
            socket.emit('room join error', 'Name cannot be empty.');
            return;
        }
        let sockets = await io.in(roomCode).fetchSockets();
        for (let idx = 0; idx < sockets.length; idx++) {
            if (sockets[idx] && sockets[idx].gameState && sockets[idx].gameState.users && sockets[idx].gameState.users.length >= 4) {
                socket.emit('room join error', 'This room is full.');
                return;
            }
            if (sockets[idx] && sockets[idx].user && sockets[idx].user.name && sockets[idx].user.name === newPlayerName) {
                socket.emit('room join error', `Username "${newPlayerName}" is already taken in this room.`);
                return;
            }
        }
        socket.user = { name: newPlayerName, image: newPlayerImage, cards: [], points: 0, rank: '', possibleTradeCardNumbers: [], cardsFromTrade: [] };
        socket.join(roomCode);
        sockets = await io.in(roomCode).fetchSockets();
        const users = sockets.map((cur) => cur.user);
        let prevMessages = sockets[0] && sockets[0].gameState && sockets[0].gameState.messages && sockets[0].gameState.messages.length > 0 ? sockets[0].gameState.messages : [];
        const message = `${newPlayerName} joined the room.`;
        prevMessages = [...prevMessages, { sender: null, content: message }];
        const usersCopy = JSON.parse(JSON.stringify(users));
        sockets.map(cur => cur.gameState = { ...(0, refreshUsers_1.default)(users, defaultGameState_1.default), host: usersCopy[0].name, messages: prevMessages, roomCode: roomCode });
        io.to(roomCode).emit('update game state', socket.gameState);
        console.log(message);
    }
    catch (err) {
        console.log(newPlayerName + ' had an error joining room ' + roomCode + ': ' + err);
    }
};
exports.default = join;
//# sourceMappingURL=join.js.map