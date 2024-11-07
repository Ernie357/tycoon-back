import { Socket } from 'socket.io';

export interface Card {
    faceValue: string,
    numberValue: string,
    suit: string,
    image: string
}

export interface User {
    name: string,
    image: string,
    cards: Card[],
    points: number,
    rank: string,
    possibleTradeCardNumbers: string[],
    cardsFromTrade: Card[]
}

export interface Message {
    sender: User | null,
    content: string
}

export interface GameState {
    activeCards: Card[],
    roundNumber: number,
    users: User[],
    turnPlayer: string,
    passCount: number,
    activeUsers: User[],
    revolution: boolean,
    betweenRounds: boolean,
    numTradesMade: number,
    tycoonLost: boolean,
    gameIsActive: boolean,
    host: string,
    messages: Message[],
    roomCode: string
}

export interface UserSocket extends Socket {
    user: User,
    roomCode?: string,
    gameState: GameState
  }


