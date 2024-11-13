import defaultGameState from "../gameMutators/defaultGameState";
import { GameState, Message, User, UserSocket } from "../types";

const reconnect = async (gameState: GameState, playerName: string, socket: UserSocket, io: any) => {
    try {
        const sockets: UserSocket[] = await io.in(gameState.roomCode).fetchSockets(); 
        const prevUser: User = gameState.users.reduce((acc: User, cur: User) => {
            return playerName === cur.name ? cur : acc;
        }, null);
        socket.roomCode = gameState.roomCode;
        socket.user = prevUser;
        socket.join(gameState.roomCode);
        const newActiveUsers = gameState.gameIsActive ? [...gameState.activeUsers, prevUser] : [];
        const message = `${playerName} reconnected.`;
        let prevMessages: Message[] = sockets[0] && sockets[0].gameState && sockets[0].gameState.messages && sockets[0].gameState.messages.length > 0 ? sockets[0].gameState.messages : [];
        prevMessages = [...prevMessages, { sender: null, content: message }];
        io.to(gameState.roomCode).emit('update game state', socket.gameState);
        sockets.forEach((cur: UserSocket) => {
            cur.gameState = {
                ...cur.gameState, 
                users: [...gameState.users, prevUser], 
                activeUsers: newActiveUsers,
                messages: prevMessages
            }
        });
        socket.gameState = sockets[0] ? sockets[0].gameState : defaultGameState;
        console.log(message);
    } catch(err) {
        console.log('error reconnecting to room: ' + err);
    }
}

export default reconnect;