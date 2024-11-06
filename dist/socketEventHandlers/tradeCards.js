"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tradeCards = async (roomCode, playerTrader, playerTradedTo, tradeCards, socket, io) => {
    try {
        console.log(`${playerTrader} traded ${tradeCards.length} cards to ${playerTradedTo}`);
        const sockets = await io.in(roomCode).fetchSockets();
        const newUsers = sockets.map((cur) => {
            let result = cur.user;
            if (cur.user.name === playerTrader) {
                const cardImages = tradeCards.map(card => card.image);
                result = { ...cur.user, cards: cur.user.cards.filter(card => !cardImages.includes(card.image)) };
            }
            else if (cur.user.name === playerTradedTo) {
                result = { ...cur.user, cardsFromTrade: tradeCards };
            }
            cur.user = result;
            return result;
        });
        sockets.map((cur) => {
            cur.gameState = {
                ...cur.gameState,
                users: newUsers,
                numTradesMade: cur.gameState.numTradesMade + 1
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    }
    catch (err) {
        console.log('error with  ' + playerTrader + ' trading cards to ' + playerTradedTo + ' in ' + roomCode + ': ' + err);
    }
};
exports.default = tradeCards;
//# sourceMappingURL=tradeCards.js.map