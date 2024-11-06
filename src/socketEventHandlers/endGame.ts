import { UserSocket } from "../types";

const endGame = async (roomCode: string, socket: UserSocket, io: any) => {
    try {
        if(!socket.gameState.gameIsActive) { return; }
        const message = 'The game has ended.';
        console.log(message);
        const sockets: UserSocket[] = await io.in(roomCode).fetchSockets();
        sockets.map((cur: UserSocket) => {
            cur.gameState = { 
                ...cur.gameState,
                gameIsActive: false,
                activeUsers: [],
                activeCards: [],
                messages: [...cur.gameState.messages, { sender: null, content: message }]
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    } catch(err) {
      console.log('error ending game in room ' + roomCode + ': ' + err);
    }
}

export default endGame;