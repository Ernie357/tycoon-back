import { GameState, Message, User, UserSocket } from "../types";
import defaultGameState from '../gameMutators/defaultGameState';
import updateRoom from "../gameMutators/updateRoom";

const join = async (gameState: GameState | null, roomCode: string, newPlayerName: string, newPlayerImage: string, activeRooms: Set<GameState>, socket: UserSocket, io: any) => {
    try {
        if(newPlayerName === '') {
            socket.emit('room join error', 'Name cannot be empty.');
            return;
        }
        let sockets: UserSocket[] = await io.in(roomCode).fetchSockets(); 
        for(let idx = 0; idx < sockets.length; idx++) {
            if(sockets[idx] && sockets[idx].gameState && sockets[idx].gameState.users && sockets[idx].gameState.users.length >= 4) {
                socket.emit('room join error', 'This room is full.');
                return;
            }
            if(sockets[idx] && sockets[idx].user && sockets[idx].user.name && sockets[idx].user.name === newPlayerName) {
                socket.emit('room join error', `Username "${newPlayerName}" is already taken in this room.`);
                return;
            }
        }
        const prevUser: User = gameState ? gameState.users.reduce((acc: User, cur: User) => {
            return newPlayerName === cur.name ? cur : acc;
        }, null) : null;
        socket.roomCode = roomCode;
        socket.user = prevUser ? { ...prevUser, image: newPlayerImage } : { name: newPlayerName, image: newPlayerImage, cards: [], points: 0, rank: '', possibleTradeCardNumbers: [], cardsFromTrade: [] };
        socket.gameState = sockets[0] && sockets[0].gameState ? { ...sockets[0].gameState } : defaultGameState;
        socket.join(roomCode);
        sockets = await io.in(roomCode).fetchSockets(); 
        const users: User[] = sockets.map((cur: UserSocket) => cur.user);
        let prevMessages: Message[] = sockets[0] && sockets[0].gameState && sockets[0].gameState.messages && sockets[0].gameState.messages.length > 0 ? sockets[0].gameState.messages : [];
        prevMessages = [...prevMessages, { sender: null, content: !gameState ? `${newPlayerName} joined the room.` : `${newPlayerName} reconnected.` }];
        const usersCopy: User[] = JSON.parse(JSON.stringify(users));
        let newState: GameState;
        sockets.forEach(cur => {
            newState = { 
                ...cur.gameState, 
                users: usersCopy, 
                host: usersCopy[0].name, 
                messages: prevMessages, 
                roomCode: roomCode,
                activeUsers: gameState && gameState.gameIsActive ? [...cur.gameState.activeUsers, prevUser] : cur.gameState.activeUsers
            };
            cur.gameState = newState;
        });   
        updateRoom(activeRooms, roomCode, newState);
        io.to(roomCode).emit('update game state', newState);
        console.log(`${newPlayerName} joined room ${roomCode}`);
    } catch(err) {
        console.log(newPlayerName + ' had an error joining room ' + roomCode + ': ' + err);
    }
}

export default join;