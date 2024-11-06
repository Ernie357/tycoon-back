import { UserSocket } from "../types";

const resetTurn = async (roomCode: string, lastPlayer: string, socket: UserSocket, io: any) => {
    try {
        let playerInActive = false;
        const sockets = await io.in(roomCode).fetchSockets();
        for(let idx = 0; idx < socket.gameState.activeUsers.length; idx++) {
          if(socket.gameState.activeUsers[idx].name === lastPlayer) {
            playerInActive = true;
          }
        } 
        const message = `Turn reset to ${lastPlayer}.`;
        console.log(message);
        sockets.map((cur: UserSocket) => {
          cur.gameState = { 
            ...cur.gameState, 
            turnPlayer: playerInActive ? lastPlayer : cur.gameState.turnPlayer, 
            passCount: 0, 
            activeCards: [],
            messages: [...cur.gameState.messages, { sender: null, content: message }]
          };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
      } catch(err) {
        console.log('error reseting turn to ' + lastPlayer + ' in room ' + roomCode  + ': ' + err);
      }
}

export default resetTurn;