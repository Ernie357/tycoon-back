import { User, UserSocket } from "../types";

const sendChatMessage = async (roomCode: string, sender: User, message: string, socket: UserSocket, io: any) => {
    try {
        console.log(sender.name + ' sent "' + message + '" in room ' + roomCode);
        const sockets: UserSocket[] = await io.in(roomCode).fetchSockets();
        sockets.map((cur: UserSocket) => {
            cur.gameState = { 
                ...cur.gameState,
                messages: [...cur.gameState.messages, { sender: sender, content: message }]
            };
        });
        io.to(roomCode).emit('update game state', socket.gameState);
    } catch(err) {
        console.log('error sending chat message in ' + roomCode + ': ' + err);
    }
}

export default sendChatMessage;