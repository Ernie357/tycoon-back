"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const distributeCards_1 = __importDefault(require("../gameMutators/distributeCards"));
const refreshUsers_1 = __importDefault(require("../gameMutators/refreshUsers"));
const startGame = async (roomCode, socket, io) => {
    try {
        const message = 'Starting game.';
        console.log(message);
        const sockets = await io.in(roomCode).fetchSockets();
        const users = sockets.map((cur) => {
            const result = { ...cur.user, points: 0, rank: '', cards: [], cardsFromTrade: [], possibleTradeCardNumbers: [] };
            cur.user = result;
            return result;
        });
        (0, distributeCards_1.default)(users);
        sockets.map((cur) => {
            cur.gameState = {
                ...(0, refreshUsers_1.default)(users, cur.gameState),
                activeUsers: JSON.parse(JSON.stringify(users)),
                roundNumber: 1,
                turnPlayer: users[0].name,
                gameIsActive: true,
                betweenRounds: false,
                numTradesMade: 0,
                tycoonLost: false,
                revolution: false,
                messages: [...cur.gameState.messages, { sender: null, content: message }]
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    }
    catch (err) {
        console.log('error starting game in ' + roomCode + ': ' + err);
    }
};
exports.default = startGame;
//# sourceMappingURL=startGame.js.map