"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
//import path from "path";
const http_1 = require("http");
const join_1 = __importDefault(require("./socketEventHandlers/join"));
const leave_1 = __importDefault(require("./socketEventHandlers/leave"));
const startGame_1 = __importDefault(require("./socketEventHandlers/startGame"));
const playCards_1 = __importDefault(require("./socketEventHandlers/playCards"));
const passTurn_1 = __importDefault(require("./socketEventHandlers/passTurn"));
const resetTurn_1 = __importDefault(require("./socketEventHandlers/resetTurn"));
const revolution_1 = __importDefault(require("./socketEventHandlers/revolution"));
const betweenRoundStart_1 = __importDefault(require("./socketEventHandlers/betweenRoundStart"));
const tradeCards_1 = __importDefault(require("./socketEventHandlers/tradeCards"));
const startNewRound_1 = __importDefault(require("./socketEventHandlers/startNewRound"));
const endGame_1 = __importDefault(require("./socketEventHandlers/endGame"));
const sendChatMessage_1 = __importDefault(require("./socketEventHandlers/sendChatMessage"));
const sendEventChatMessage_1 = __importDefault(require("./socketEventHandlers/sendEventChatMessage"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
//app.use(express.static(path.join(__dirname, '../front/build')));
const activeRoomCodes = new Set();
io.on('connection', (socket) => {
    socket.on('join', (roomCode, playerName, playerImage) => {
        (0, join_1.default)(roomCode, playerName, playerImage, socket, io);
    });
    socket.on('leave', (roomCode) => {
        (0, leave_1.default)(roomCode, activeRoomCodes, socket, io);
    });
    socket.on('start game', (roomCode) => {
        (0, startGame_1.default)(roomCode, socket, io);
    });
    socket.on('play cards', (roomCode, playedCards, playerName) => {
        (0, playCards_1.default)(roomCode, playerName, playedCards, socket, io);
    });
    socket.on('pass turn', (roomCode) => {
        (0, passTurn_1.default)(roomCode, socket, io);
    });
    socket.on('reset turn', (roomCode, lastPlayer) => {
        (0, resetTurn_1.default)(roomCode, lastPlayer, socket, io);
    });
    socket.on('revolution', (roomCode) => {
        (0, revolution_1.default)(roomCode, socket, io);
    });
    socket.on('between round start', (roomCode) => {
        (0, betweenRoundStart_1.default)(roomCode, socket, io);
    });
    socket.on('trade cards', (roomCode, playerTrader, playerTradedTo, cards) => {
        (0, tradeCards_1.default)(roomCode, playerTrader, playerTradedTo, cards, socket, io);
    });
    socket.on('start new round', (roomCode) => {
        (0, startNewRound_1.default)(roomCode, socket, io);
    });
    socket.on('end game', (roomCode) => {
        (0, endGame_1.default)(roomCode, socket, io);
    });
    socket.on('send chat message', (roomCode, sender, message) => {
        (0, sendChatMessage_1.default)(roomCode, sender, message, socket, io);
    });
    socket.on('send event chat message', (roomCode, message) => {
        (0, sendEventChatMessage_1.default)(roomCode, message, socket, io);
    });
    socket.on('disconnect', () => {
        try {
            console.log(socket.user.name + ' disconnected');
        }
        catch (err) {
            console.log('There was an error disconnecting a socket: ' + err);
        }
    });
});
app.get('/roomcode', (req, res) => {
    try {
        let code;
        do {
            code = Math.floor(10000 + Math.random() * 90000).toString();
        } while (activeRoomCodes.has(code));
        activeRoomCodes.add(code);
        res.send(code);
    }
    catch (err) {
        console.log('error in generating random room code: ' + err);
        res.send(null);
    }
});
app.get('/isRoomCodeValid', (req, res) => {
    try {
        const code = req.query.roomCode.toString();
        if (activeRoomCodes.has(code)) {
            res.send(true);
        }
        else {
            res.send(false);
        }
    }
    catch (err) {
        console.log('error in checking to see if room code is valid: ' + err);
        res.send(false);
    }
});
app.get('/');
/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/build', 'index.html'));
});
*/
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map