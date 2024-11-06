"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leave = async (roomCode, activeRoomCodes, socket, io) => {
    try {
        const sockets = await io.in(roomCode).fetchSockets();
        const leavingUsername = socket.user.name;
        const message = `${leavingUsername} left the room.`;
        console.log(message);
        const newUsers = socket.gameState.users.filter((user) => {
            return user.name !== leavingUsername;
        });
        const newActiveUsers = socket.gameState.activeUsers.filter((user) => {
            return user.name !== leavingUsername;
        });
        if (newUsers.length <= 0) {
            activeRoomCodes.delete(roomCode);
            return;
        }
        sockets.map((cur) => {
            cur.gameState = {
                ...cur.gameState,
                users: newUsers,
                activeUsers: newActiveUsers,
                host: newUsers[0] && newUsers[0].name ? newUsers[0].name : '',
                messages: [...cur.gameState.messages, { sender: null, content: message }]
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
        socket.leave(roomCode);
        socket.disconnect();
    }
    catch (err) {
        console.log('player leaving error in room ' + roomCode + ': ' + err);
    }
};
exports.default = leave;
//# sourceMappingURL=leave.js.map