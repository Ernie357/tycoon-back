import { GameState, User } from '../types';

const getJoinState = (users: User[], prevState: GameState) => {
    return {
        ...prevState, 
        users: users
    }
}

export default getJoinState;