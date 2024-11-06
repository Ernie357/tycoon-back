import { User } from "../types";

const getPlayerByRank = (rank: string, users: User[]): string | null => {
    for(let idx = 0; idx < users.length; idx++) {
        if(users[idx].rank === rank) {
            return users[idx].name;
        }
    }
    return null;
}

export default getPlayerByRank;