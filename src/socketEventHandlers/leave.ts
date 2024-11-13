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
        let newTurnPlayer = socket.gameState.turnPlayer;
        if(socket.gameState.turnPlayer === socket.user.name) {
            sockets.forEach((cur: UserSocket, idx: number) => {
                if(cur.user.name === socket.gameState.turnPlayer) {
                    if(idx === sockets.length - 1) {
                        newTurnPlayer = sockets[0].user.name;
                    } else {
                        newTurnPlayer = sockets[idx + 1].user.name;
                    }
                }
            }); 
        }
        const newState: GameState = {
            ...sockets[0].gameState,
            users: newUsers,
            activeUsers: newActiveUsers,
            host: newUsers[0] && newUsers[0].name ? newUsers[0].name : '',
            messages: [...sockets[0].gameState.messages, { sender: null, content: message }],
            turnPlayer: newTurnPlayer
        }
        sockets.forEach((cur: UserSocket) => {
            cur.gameState = newState;
        });
        io.to(roomCode).emit('update game state', newState);
        socket.leave(roomCode);
    } catch(err) {
        console.log('player leaving error in room ' + roomCode + ': ' + err);
    }
}

export default leave;