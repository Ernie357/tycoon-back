import { GameState, User, UserSocket } from "../types";

const leave = async (roomCode: string, activeRoomCodes: Set<string>, socket: UserSocket, io: any) => {
    try {
        const sockets: UserSocket[] = await io.in(roomCode).fetchSockets();
        const leavingUsername = socket.user.name;
        const message = `${leavingUsername} left the room.`;
        console.log(message);
        const newUsers = socket.gameState.users.filter((user: User) => {
            return user.name !== leavingUsername;
        });
        const newActiveUsers = socket.gameState.activeUsers.filter((user: User) => {
            return user.name !== leavingUsername;
        });
        if(newUsers.length <= 0) {
            activeRoomCodes.delete(roomCode);
            return;
        }
        const newState: GameState = {
            ...sockets[0].gameState,
            users: newUsers,
            activeUsers: newActiveUsers,
            host: newUsers[0] && newUsers[0].name ? newUsers[0].name : '',
            messages: [...sockets[0].gameState.messages, { sender: null, content: message }]
        }
        sockets.forEach((cur: UserSocket) => {
            cur.gameState = newState;
        });
        io.to(roomCode).emit('update game state', newState);
        console.log('update game state has been emitted for leave with the following gamestate: ' + JSON.stringify(newState));
        socket.leave(roomCode);
    } catch(err) {
        console.log('player leaving error in room ' + roomCode + ': ' + err);
    }
}

export default leave;