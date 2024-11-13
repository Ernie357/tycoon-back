import { UserSocket } from "../types";

const disconnect = async (socket: UserSocket, activeRoomCodes: Set<string>) => {
    try {
        if(socket.gameState && socket.gameState.users && socket.roomCode && socket.gameState.users.length <= 1) {
          activeRoomCodes.delete(socket.roomCode);
        }
        console.log(`${socket.user.name} disconnected.`);
      } catch(err) {
        console.log('There was an error disconnecting a socket: ' + err);
      }
}

export default disconnect;