"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateRoom = (activeRooms, roomCode, newState) => {
    let targetRoom;
    activeRooms.forEach((room) => {
        if (room.roomCode === roomCode) {
            targetRoom = room;
        }
    });
    if (targetRoom) {
        activeRooms.delete(targetRoom);
        activeRooms.add({ ...newState, isRoomPrivate: targetRoom.isRoomPrivate });
    }
};
exports.default = updateRoom;
//# sourceMappingURL=updateRoom.js.map