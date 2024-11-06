import { User, UserSocket } from "../types";

const leave = async (roomCode: string, activeRoomCodes: Set<string>, socket: UserSocket, io: any) => {
    try {
        const sockets = await io.in(roomCode).fetchSockets();
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
        sockets.map((cur: UserSocket) => {
            cur.gameState = {
                ...cur.gameState,
                users: newUsers,
                activeUsers: newActiveUsers,
                host: newUsers[0] && newUsers[0].name ? newUsers[0].name : '',
                messages: [...cur.gameState.messages, { sender: null, content: message }]
            }
        });
        io.to(roomCode).emit('update game state', socket.gameState);
        socket.leave(roomCode);
        socket.disconnect();
    } catch(err) {
        console.log('player leaving error in room ' + roomCode + ': ' + err);
    }
}

export default leave;