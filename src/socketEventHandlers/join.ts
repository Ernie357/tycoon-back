import { Message, User, UserSocket } from "../types";
import defaultGameState from '../gameMutators/defaultGameState';

const join = async (roomCode: string, newPlayerName: string, newPlayerImage: string, socket: UserSocket, io: any) => {
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
        socket.roomCode = roomCode;
        socket.user = { name: newPlayerName, image: newPlayerImage, cards: [], points: 0, rank: '', possibleTradeCardNumbers: [], cardsFromTrade: [] };
        socket.join(roomCode);
        sockets = await io.in(roomCode).fetchSockets(); 
        const users: User[] = sockets.map((cur: UserSocket) => cur.user);
        let prevMessages: Message[] = sockets[0] && sockets[0].gameState && sockets[0].gameState.messages && sockets[0].gameState.messages.length > 0 ? sockets[0].gameState.messages : [];
        const message = `${newPlayerName} joined the room.`;
        prevMessages = [...prevMessages, { sender: null, content: message }];
        const usersCopy: User[] = JSON.parse(JSON.stringify(users));
        sockets.forEach(cur => cur.gameState = { ...defaultGameState, users: usersCopy, host: usersCopy[0].name, messages: prevMessages, roomCode: roomCode });
        io.to(roomCode).emit('update game state', socket.gameState);
        console.log(message);
    } catch(err) {
        console.log(newPlayerName + ' had an error joining room ' + roomCode + ': ' + err);
    }
}

export default join;