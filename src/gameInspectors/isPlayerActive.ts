import { UserSocket } from "../types";

const isPlayerRankActive = (rank: string, socket: UserSocket) => {
    for(let idx = 0; idx < socket.gameState.activeUsers.length; idx++) {
        if(socket.gameState.activeUsers[idx].rank === rank) {
            return true;
        }
    }
    return false;
}

export default isPlayerRankActive;