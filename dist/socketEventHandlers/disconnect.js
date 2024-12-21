"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disconnect = async (socket, activeRooms) => {
    try {
        if (socket.gameState && socket.gameState.users && socket.roomCode && socket.gameState.users.length <= 1) {
            activeRooms.forEach((room) => {
                if (room.roomCode === socket.roomCode) {
                    activeRooms.delete(room);
                }
            });
        }
        console.log(`${socket.user.name} disconnected.`);
    }
    catch (err) {
        console.log('There was an error disconnecting a socket: ' + err);
    }
};
exports.default = disconnect;
//# sourceMappingURL=disconnect.js.map