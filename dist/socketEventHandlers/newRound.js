"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const newRound = async (roomCode, io) => {
    try {
        console.log('starting new round in room ' + roomCode);
        const sockets = await io.in(roomCode).fetchSockets();
        sockets.map(cur => {
            cur.gameState = { ...cur.gameState, roundNumber: cur.gameState.roundNumber + 1, betweenRounds: true };
        });
    }
    catch (err) {
        console.log('error starting a new round in room ' + roomCode + ': ' + err);
    }
};
exports.default = newRound;
//# sourceMappingURL=newRound.js.map