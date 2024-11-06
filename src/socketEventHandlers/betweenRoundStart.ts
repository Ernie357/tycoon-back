import getTradeCards from "../gameInspectors/getTradeCards";
import distributeCards from "../gameMutators/distributeCards";
import { User, UserSocket } from "../types";

const betweenRoundStart = async (roomCode: string, socket: UserSocket, io: any) => {
    try {
      if(socket.gameState.betweenRounds) { return; }
      console.log('between rounds has begun in room ' + roomCode);
      const sockets: UserSocket[] = await io.in(roomCode).fetchSockets();
      const loserName = socket.gameState.activeUsers[0].name;
      let newUsers = sockets.map((cur: UserSocket) => {
        const result: User = cur.user.name === loserName ? { ...cur.user, rank: socket.gameState.tycoonLost ? 'poor' : 'beggar', points: socket.gameState.tycoonLost ? cur.user.points + 10 : cur.user.points, cards: [] } : { ...cur.user, cards: [] };
        cur.user = result;
        return result;
      });
      distributeCards(newUsers);
      sockets.map((cur: UserSocket) => {
        const result = { ...cur.user, possibleTradeCardNumbers: getTradeCards(cur.user.cards, cur.user.rank) };
        cur.user = result;
      });
      newUsers = newUsers.map((user: User) => {
        return { ...user, possibleTradeCardNumbers: getTradeCards(user.cards, user.rank) };
      });
      sockets.map((cur: UserSocket) => {
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
    } catch(err) {
        console.log('error going between rounds in room ' + roomCode + ': ' + err);
    }
}

export default betweenRoundStart;