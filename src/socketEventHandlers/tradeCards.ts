import { Card, User, UserSocket } from "../types";

const tradeCards = async (roomCode: string, playerTrader: string, playerTradedTo: string, tradeCards: Card[], socket: UserSocket, io: any) => {
    try {
        console.log(`${playerTrader} traded ${tradeCards.length} cards to ${playerTradedTo}`);
        const sockets: UserSocket[] = await io.in(roomCode).fetchSockets();
        const newUsers: User[] = sockets.map((cur: UserSocket) => {
            let result: User = cur.user;
            if(cur.user.name === playerTrader) {
                const cardImages = tradeCards.map(card => card.image);
                result = { ...cur.user, cards: cur.user.cards.filter(card => !cardImages.includes(card.image)) };
            } else if(cur.user.name === playerTradedTo) {
                result = { ...cur.user, cardsFromTrade: tradeCards };
            }
            cur.user = result;
            return result;
        });
        sockets.map((cur: UserSocket) => {
            cur.gameState = {
              ...cur.gameState, 
              users: newUsers,
              numTradesMade: cur.gameState.numTradesMade + 1 
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    } catch(err) {
        console.log('error with  ' + playerTrader + ' trading cards to ' + playerTradedTo + ' in ' + roomCode + ': ' + err);
    }
}

export default tradeCards;