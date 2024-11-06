"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getPlayerByRank_1 = __importDefault(require("../gameInspectors/getPlayerByRank"));
const startNewRound = async (roomCode, socket, io) => {
    try {
        if (!socket.gameState.betweenRounds) {
            return;
        }
        console.log('Starting new round in room ' + roomCode);
        const sockets = await io.in(roomCode).fetchSockets();
        const newUsers = sockets.map((cur) => {
            const result = { ...cur.user, cards: [...cur.user.cards, ...cur.user.cardsFromTrade], cardsFromTrade: [], possibleTradeCardNumbers: [] };
            cur.user = result;
            return result;
        });
        const beggarPlayer = (0, getPlayerByRank_1.default)('beggar', newUsers);
        sockets.map((cur) => {
            cur.gameState = {
                ...cur.gameState,
                betweenRounds: false,
                users: newUsers,
                turnPlayer: beggarPlayer ? beggarPlayer : newUsers[0].name,
                activeUsers: JSON.parse(JSON.stringify(newUsers)),
                activeCards: [],
                revolution: false,
                passCount: 0,
                numTradesMade: 0
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    }
    catch (err) {
        console.log('error starting a new round in room  ' + roomCode + ': ' + err);
    }
};
exports.default = startNewRound;
//# sourceMappingURL=startNewRound.js.map