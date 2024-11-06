"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPlayerByRank = (rank, users) => {
    for (let idx = 0; idx < users.length; idx++) {
        if (users[idx].rank === rank) {
            return users[idx].name;
        }
    }
    return null;
};
exports.default = getPlayerByRank;
//# sourceMappingURL=getPlayerByRank.js.map