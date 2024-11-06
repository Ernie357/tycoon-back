import { UserSocket, Card, User, GameState } from "../types";
import refreshUsers from "../gameMutators/refreshUsers";
import isPlayerRankActive from "../gameInspectors/isPlayerActive";
import getCardsString from "../gameInspectors/getCardsString";

const playCards = async (roomCode: string, playerName: string, playedCards: Card[], socket: UserSocket, io: any) => {
    try {
      const sockets = await io.in(roomCode).fetchSockets();
      let playerFinished = false;
      let tycoonLost = false;
      let playerFinishedName = '';
      const users = sockets.map((cur: UserSocket) => {
        if(cur.user.name === playerName) {
          for(let i = 0; i < playedCards.length; i++) {
            const currentCard = playedCards[i];
            cur.user.cards = cur.user.cards.filter((card: Card) => card.image !== currentCard.image);
          }
          if(cur.user.cards.length <= 0) {
            if(socket.gameState.roundNumber > 1 && isPlayerRankActive('tycoon', socket) && socket.user.rank !== 'tycoon') {
              console.log('The tycoon is a big fat loser!!!');
              tycoonLost = true;
            }
            playerFinished = true;
            playerFinishedName = cur.user.name;
            console.log(playerName + ' finished.');
            switch(cur.gameState.activeUsers.length) {
              case 4: 
                cur.user.rank = 'tycoon';
                cur.user.points += 30;
                break;
              case 3: 
                cur.user.rank = 'rich';
                cur.user.points += 20;
                break;
              case 2:
                cur.user.rank = socket.gameState.tycoonLost ? 'rich' : 'poor';
                cur.user.points += socket.gameState.tycoonLost ? 20 : 10;
                break;
              case 1: 
                cur.user.rank = 'beggar';
                break;
              default: 
                cur.user.rank = 'beggar';
                break;
            }
          }
        }
        return cur.user;
      });
      let newUsers: User[] = users;
      let newActiveUsers = playerFinished ? socket.gameState.activeUsers.filter((player: User) => player.name !== playerName) : socket.gameState.activeUsers;
      if(tycoonLost) {
        newActiveUsers = newActiveUsers.filter((player: User) => player.rank !== 'tycoon');
        newUsers = socket.gameState.users.map((player: User) => player.rank === 'tycoon' ? { ...player, cards: [] } : player)
        sockets.map((cur: UserSocket) => {
          if(cur.user.rank === 'tycoon' && cur.user.name !== playerFinishedName) {
            cur.user.rank = 'beggar';
            cur.user.cards = [];
          }
          cur.gameState.tycoonLost = true;
        }); 
      }
      let newTurnPlayer: string;
      for(let idx = 0; idx < socket.gameState.activeUsers.length; idx++) {
        if(socket.gameState.activeUsers[idx].name === socket.gameState.turnPlayer) {
          if(idx === socket.gameState.activeUsers.length - 1) {
            if(tycoonLost && socket.gameState.activeUsers[0].rank === 'tycoon') {
              newTurnPlayer = socket.gameState.activeUsers[1].name;
            } else {
              newTurnPlayer = socket.gameState.activeUsers[0].name;
            }
          } else if(idx === socket.gameState.activeUsers.length - 2) {
            if(tycoonLost && socket.gameState.activeUsers[idx + 1].rank === 'tycoon') {
              newTurnPlayer = socket.gameState.activeUsers[0].name;
            } else {
              newTurnPlayer = socket.gameState.activeUsers[idx + 1].name;
            }
          } else {
            if(tycoonLost && socket.gameState.activeUsers[idx + 1].rank === 'tycoon') {
              newTurnPlayer = socket.gameState.activeUsers[idx + 2].name;
            } else {
              newTurnPlayer = socket.gameState.activeUsers[idx + 1].name;
            }
          }
        }
      }
      const cardsString = getCardsString(playedCards);
      const message = `${playerName} played ${cardsString}`;
      console.log(message);
      sockets.map((cur: UserSocket) => {
        const newState: GameState = { 
          ...cur.gameState, 
          activeCards: playedCards, 
          turnPlayer: newTurnPlayer, 
          passCount: 0, 
          activeUsers: newActiveUsers, 
          users: newUsers,
          messages: [...cur.gameState.messages, { sender: null, content: message }]
        };
        cur.gameState = refreshUsers(users, newState);
      });
      io.to(roomCode).emit('update game state', socket.gameState);
    } catch(err) {
      console.log('error in ' + playerName + ' playing cards in room ' + roomCode + ': ' + err);
    }
}

export default playCards;