import { UserSocket } from "../types";

const passTurn = async (roomCode: string, socket: UserSocket, io: any) => {
    try {
        const sockets = await io.in(roomCode).fetchSockets();
        let newTurnPlayer: string;
        for(let idx = 0; idx < socket.gameState.activeUsers.length; idx++) {
          const cur = socket.gameState.activeUsers[idx];
          if(cur.name === socket.gameState.turnPlayer) {
            if(idx === socket.gameState.activeUsers.length - 1) {
              newTurnPlayer = socket.gameState.activeUsers[0].name;
            } else {
              newTurnPlayer = socket.gameState.activeUsers[idx + 1].name;
            }
          }
        }
        const message = `${socket.user.name} passed their turn.`;
        console.log(message);
        sockets.map((cur: UserSocket) => {
          cur.gameState = { 
            ...cur.gameState, 
            turnPlayer: newTurnPlayer,
            passCount: cur.gameState.passCount + 1,
            messages: [...cur.gameState.messages, { sender: null, content: message }] 
          };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
      } catch(err) {
        console.log('error passing turn in room ' + roomCode + ': ' + err);
      }
}

export default passTurn;