"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isPlayerRankActive = (rank, socket) => {
    for (let idx = 0; idx < socket.gameState.activeUsers.length; idx++) {
        if (socket.gameState.activeUsers[idx].rank === rank) {
            return true;
        }
    }
    return false;
};
exports.default = isPlayerRankActive;
//# sourceMappingURL=isPlayerActive.js.map