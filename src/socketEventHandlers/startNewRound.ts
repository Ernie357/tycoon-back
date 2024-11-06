import getPlayerByRank from "../gameInspectors/getPlayerByRank";
import { User, UserSocket } from "../types";

const startNewRound = async (roomCode: string, socket: UserSocket, io: any) => {
    try {
        if(!socket.gameState.betweenRounds) { return; }
        console.log('Starting new round in room ' + roomCode);
        const sockets: UserSocket[] = await io.in(roomCode).fetchSockets();
        const newUsers = sockets.map((cur: UserSocket) => {
            const result: User = { ...cur.user, cards: [ ...cur.user.cards, ...cur.user.cardsFromTrade ], cardsFromTrade: [], possibleTradeCardNumbers: [] };
            cur.user = result;
            return result;
        });
        const beggarPlayer = getPlayerByRank('beggar', newUsers);
        sockets.map((cur: UserSocket) => {
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
    } catch(err) {
        console.log('error starting a new round in room  ' + roomCode + ': ' + err);
    }
}

export default startNewRound;