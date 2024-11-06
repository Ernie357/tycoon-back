"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getTycoonPlayer = (users) => {
    for (let idx = 0; idx < users.length; idx++) {
        if (users[idx].rank === 'tycoon') {
            return users[idx].name;
        }
    }
    return null;
};
exports.default = getTycoonPlayer;
//# sourceMappingURL=getTycoonPlayer.js.map