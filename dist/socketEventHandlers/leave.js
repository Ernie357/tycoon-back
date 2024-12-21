"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const updateRoom_1 = __importDefault(require("../gameMutators/updateRoom"));
const leave = async (roomCode, activeRooms, socket, io) => {
    try {
        const sockets = await io.in(roomCode).fetchSockets();
        const leavingUsername = socket.user.name;
        const message = `${leavingUsername} left the room.`;
        const newUsers = socket.gameState.users.filter((user) => {
            return user.name !== leavingUsername;
        });
        const newActiveUsers = socket.gameState.activeUsers.filter((user) => {
            return user.name !== leavingUsername;
        });
        if (newUsers.length <= 0) {
            activeRooms.forEach((room) => {
                if (room.roomCode === roomCode) {
                    console.log(`Room ${roomCode} has been disbanded.`);
                    activeRooms.delete(room);
                }
            });
            return;
        }
        let newTurnPlayer = socket.gameState.turnPlayer;
        if (socket.gameState.turnPlayer === socket.user.name) {
            sockets.forEach((cur, idx) => {
                if (cur.user.name === socket.gameState.turnPlayer) {
                    if (idx === sockets.length - 1) {
                        newTurnPlayer = sockets[0].user.name;
                    }
                    else {
                        newTurnPlayer = sockets[idx + 1].user.name;
                    }
                }
            });
        }
        const newState = {
            ...sockets[0].gameState,
            users: newUsers,
            activeUsers: newActiveUsers,
            host: newUsers[0] && newUsers[0].name ? newUsers[0].name : '',
            messages: [...sockets[0].gameState.messages, { sender: null, content: message }],
            turnPlayer: newTurnPlayer
        };
        sockets.forEach((cur) => {
            cur.gameState = newState;
        });
        (0, updateRoom_1.default)(activeRooms, roomCode, newState);
        io.to(roomCode).emit('update game state', newState);
        socket.leave(roomCode);
        console.log(`${leavingUsername} left room ${roomCode}`);
    }
    catch (err) {
        console.log('player leaving error in room ' + roomCode + ': ' + err);
    }
};
exports.default = leave;
//# sourceMappingURL=leave.js.map