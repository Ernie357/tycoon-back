import { UserSocket } from "../types";

const sendEventChatMessage = async (roomCode: string, message: string, socket: UserSocket, io: any) => {
    try {
        console.log('event message "' + message + '" sent in room ' + roomCode);
        const sockets: UserSocket[] = await io.in(roomCode).fetchSockets();
        sockets.map((cur: UserSocket) => {
            cur.gameState = { 
                ...cur.gameState,
                messages: [...cur.gameState.messages, { sender: null, content: message }]
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    } catch(err) {
        console.log('error sending event chat message in ' + roomCode + ': ' + err);
    }
}

export default sendEventChatMessage;