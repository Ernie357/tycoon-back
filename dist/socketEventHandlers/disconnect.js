"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disconnect = async (socket, activeRoomCodes) => {
    try {
        if (socket.gameState && socket.gameState.users && socket.roomCode && socket.gameState.users.length <= 1) {
            activeRoomCodes.delete(socket.roomCode);
        }
        console.log(`${socket.user.name} disconnected.`);
    }
    catch (err) {
        console.log('There was an error disconnecting a socket: ' + err);
    }
};
exports.default = disconnect;
//# sourceMappingURL=disconnect.js.map