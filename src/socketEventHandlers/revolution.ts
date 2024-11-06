import { GameState, UserSocket } from "../types";

const revolution = async (roomCode: string, socket: UserSocket, io: any) => {
    try {
      const message = `${socket.user.name} started a revolution!`;
      console.log(message);
      const sockets: UserSocket[] = await io.in(roomCode).fetchSockets();
      sockets.map((cur: UserSocket) => {
        cur.gameState = { 
          ...cur.gameState, 
          revolution: !cur.gameState.revolution,
          messages: [...cur.gameState.messages, { sender: null, content: message }] 
        };
      });
      io.to(roomCode).emit('update game state', socket.gameState);
    } catch(err) {
      console.log('error starting a revolution in room ' + roomCode + ': ' + err);
    }
}

export default revolution;