import { GameState, UserSocket } from "../types";

const disconnect = async (socket: UserSocket, activeRooms: Set<GameState>) => {
    try {
        if(socket.gameState && socket.gameState.users && socket.roomCode && socket.gameState.users.length <= 1) {
          activeRooms.forEach((room: GameState) => {
            if(room.roomCode === socket.roomCode) {
                activeRooms.delete(room);
            }
        });
        }
        console.log(`${socket.user.name} disconnected.`);
      } catch(err) {
        console.log('There was an error disconnecting a socket: ' + err);
      }
}

export default disconnect;