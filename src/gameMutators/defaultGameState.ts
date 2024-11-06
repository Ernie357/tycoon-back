import { GameState } from "../types";

const defaultGameState: GameState = {
    activeCards: [],
    roundNumber: 0,
    users: [],
    turnPlayer: '',
    passCount: 0,
    activeUsers: [],
    revolution: false,
    betweenRounds: false,
    numTradesMade: 0,
    tycoonLost: false,
    gameIsActive: false,
    host: '',
    messages: [],
    roomCode: ''
}
export default defaultGameState;