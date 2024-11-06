"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getTradeCards_1 = __importDefault(require("../gameInspectors/getTradeCards"));
const distributeCards_1 = __importDefault(require("../gameMutators/distributeCards"));
const betweenRoundStart = async (roomCode, socket, io) => {
    try {
        if (socket.gameState.betweenRounds) {
            return;
        }
        console.log('between rounds has begun in room ' + roomCode);
        const sockets = await io.in(roomCode).fetchSockets();
        const loserName = socket.gameState.activeUsers[0].name;
        let newUsers = sockets.map((cur) => {
            const result = cur.user.name === loserName ? { ...cur.user, rank: socket.gameState.tycoonLost ? 'poor' : 'beggar', points: socket.gameState.tycoonLost ? cur.user.points + 10 : cur.user.points, cards: [] } : { ...cur.user, cards: [] };
            cur.user = result;
            return result;
        });
        (0, distributeCards_1.default)(newUsers);
        sockets.map((cur) => {
            const result = { ...cur.user, possibleTradeCardNumbers: (0, getTradeCards_1.default)(cur.user.cards, cur.user.rank) };
            cur.user = result;
        });
        newUsers = newUsers.map((user) => {
            return { ...user, possibleTradeCardNumbers: (0, getTradeCards_1.default)(user.cards, user.rank) };
        });
        sockets.map((cur) => {
            cur.gameState = {
                ...cur.gameState,
                roundNumber: cur.gameState.roundNumber + 1,
                betweenRounds: true,
                revolution: false,
                users: newUsers,
                turnPlayer: '',
                activeUsers: [],
                activeCards: [],
                numTradesMade: 0,
                tycoonLost: false
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    }
    catch (err) {
        console.log('error going between rounds in room ' + roomCode + ': ' + err);
    }
};
exports.default = betweenRoundStart;
//# sourceMappingURL=betweenRoundStart.js.map