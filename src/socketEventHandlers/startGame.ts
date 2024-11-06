import distributeCards from "../gameMutators/distributeCards";
import refreshUsers from "../gameMutators/refreshUsers";
import { User, UserSocket } from "../types";

const startGame = async (roomCode: string, socket: UserSocket, io: any) => {
    try {
      const message = 'Starting game.';
      console.log(message);
      const sockets: UserSocket[] = await io.in(roomCode).fetchSockets();
      const users = sockets.map((cur: UserSocket) => {
        const result: User = { ...cur.user, points: 0, rank: '', cards: [], cardsFromTrade: [], possibleTradeCardNumbers: [] };
        cur.user = result;
        return result;
      });
      distributeCards(users);
      sockets.map((cur: UserSocket) => {
        cur.gameState = { 
          ...refreshUsers(users, cur.gameState), 
          activeUsers: JSON.parse(JSON.stringify(users)), 
          roundNumber: 1, 
          turnPlayer: users[0].name,
          gameIsActive: true,
          betweenRounds: false,
          numTradesMade: 0,
          tycoonLost: false,
          revolution: false,
          messages: [...cur.gameState.messages, { sender: null, content: message }]
        }
      });
      io.to(roomCode).emit('update game state', socket.gameState);
    } catch(err) {
      console.log('error starting game in ' + roomCode + ': ' + err);
    }
}

export default startGame;