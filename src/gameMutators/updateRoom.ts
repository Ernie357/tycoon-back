import { GameState } from '../types';

const updateRoom = (activeRooms: Set<GameState>, roomCode: string, newState: GameState) => {
    let targetRoom: GameState;
    activeRooms.forEach((room: GameState) => {
        if(room.roomCode === roomCode) {
            targetRoom = room;
        }
    });
    if(targetRoom) {
        activeRooms.delete(targetRoom);
        activeRooms.add({...newState, isRoomPrivate: targetRoom.isRoomPrivate });
    }
}

export default updateRoom;