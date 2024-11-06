"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getJoinState = (users, prevState) => {
    return {
        ...prevState,
        users: users
    };
};
exports.default = getJoinState;
//# sourceMappingURL=getJoinState.js.map