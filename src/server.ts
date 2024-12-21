import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { Server, Socket } from 'socket.io';
//import path from "path";
import { createServer } from "http";
import { Card, GameState, User } from "./types"; 
import join from "./socketEventHandlers/join";
import leave from "./socketEventHandlers/leave";
import startGame from "./socketEventHandlers/startGame";
import playCards from "./socketEventHandlers/playCards";
import passTurn from "./socketEventHandlers/passTurn";
import resetTurn from "./socketEventHandlers/resetTurn";
import revolution from "./socketEventHandlers/revolution";
import betweenRoundStart from './socketEventHandlers/betweenRoundStart';
import tradeCards from "./socketEventHandlers/tradeCards";
import startNewRound from "./socketEventHandlers/startNewRound";
import endGame from "./socketEventHandlers/endGame";
import sendChatMessage from "./socketEventHandlers/sendChatMessage";
import sendEventChatMessage from "./socketEventHandlers/sendEventChatMessage";
import disconnect from "./socketEventHandlers/disconnect";
import defaultGameState from "./gameMutators/defaultGameState";
import crypto from 'crypto';

dotenv.config();

interface UserSocket extends Socket {
  user: User,
  gameState: GameState
}

const app: Express = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 5001;
const server = createServer(app);
const io = new Server(server);
//app.use(express.static(path.join(__dirname, '../front/build')));

const activeRooms = new Set<GameState>();

io.on('connection', (socket: UserSocket) => {
  socket.on('join', (gameState: GameState, roomCode: string, playerName: string, playerImage: string) => {
    join(gameState, roomCode, playerName, playerImage, activeRooms, socket, io);
  });
  socket.on('leave', (roomCode: string) => {
    leave(roomCode, activeRooms, socket, io);
  });
  socket.on('start game', (roomCode: string) => {
    startGame(roomCode, socket, io);
  });
  socket.on('play cards', (roomCode: string, playedCards: Card[], playerName: string) => {
    playCards(roomCode, playerName, playedCards, socket, io);
  });
  socket.on('pass turn', (roomCode: string) => {
    passTurn(roomCode, socket, io);
  });
  socket.on('reset turn', (roomCode: string, lastPlayer: string) => {
    resetTurn(roomCode, lastPlayer, socket, io);
  });
  socket.on('revolution', (roomCode: string) => {
    revolution(roomCode, socket, io);
  });
  socket.on('between round start', (roomCode: string) => {
    betweenRoundStart(roomCode, socket, io);
  });
  socket.on('trade cards', (roomCode: string, playerTrader: string, playerTradedTo: string, cards: Card[]) => {
    tradeCards(roomCode, playerTrader, playerTradedTo, cards, socket, io);
  });
  socket.on('start new round', (roomCode: string) => {
    startNewRound(roomCode, socket, io);
  });
  socket.on('end game', (roomCode: string) => {
    endGame(roomCode, socket, io);
  });
  socket.on('send chat message', (roomCode: string, sender: User, message: string) => {
    sendChatMessage(roomCode, sender, message, socket, io);
  });
  socket.on('send event chat message', (roomCode: string, message: string) => {
    sendEventChatMessage(roomCode, message, socket, io);
  });
  socket.on('disconnect', () => {
    disconnect(socket, activeRooms);
  });
});

const generateHash = (playerName: string, roomCode: string, secret: string): string => {
  return crypto.createHmac('sha256', secret).update(`${playerName}:${roomCode}`).digest('hex');
};

app.get('/roomcode', (req: Request, res: Response) => {
  const { name, image, isRoomPrivate } = req.query;
  const isPrivate = isRoomPrivate === 'true' || isRoomPrivate === '1';
  try {
    let newGameState: GameState;
    let roomCodeExists = false;
    do {
        name ? console.log(`Grabbing a code for user "${name}", isRoomPrivate = ${isPrivate}`) : console.log('Could not find name for room code grab.');
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        newGameState = { ...defaultGameState, roomCode: code, host: name ? name.toString() : '', isRoomPrivate: isPrivate };
        activeRooms.forEach((room: GameState) => {
          if(room.roomCode === code) {
              roomCodeExists = true;
          }
      });
    } while (roomCodeExists);
    activeRooms.add(newGameState); 
    const hash = generateHash(name.toString(), newGameState.roomCode, process.env.SECRET);
    res.send(`/${newGameState.roomCode}?playerName=${encodeURIComponent(name.toString())}&playerImage=${encodeURIComponent(image.toString())}&hash=${hash}`);
  } catch(err) {
    console.log('error in generating random room code: ' + err);
    res.send(null);
  }
});

app.get('/isRoomValid', (req: Request, res: Response) => {
  try {
    const { code, name, image, hash } = req.query;
    const expectedHash = generateHash(name.toString(), code.toString(), process.env.SECRET);
    if(!code || !name || !image || !hash || hash !== expectedHash) {
      res.send(false);
    } else {
      res.send(true);
    }
  } catch(err) {
    console.log('error in seeing if room is valid: ' + err);
    res.send(false);
  }
});

app.get('/isRoomCodeValid', (req: Request, res: Response) => {
  try {
    const code = req.query.roomCode.toString();
    let roomCodeExists = false;
    activeRooms.forEach((room: GameState) => {
      if(room.roomCode === code) {
          roomCodeExists = true;
      }
    });
    if(roomCodeExists) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch(err) {
    console.log('error in checking to see if room code is valid: ' + err);
    res.send(false);
  }
});

app.get('/rooms', (req: Request, res: Response) => {
  try {
    const roomsArray = Array.from(activeRooms);
    const validRooms = roomsArray.filter((room: GameState) => {
      return room.users.length < 4 && room.users.length > 0 && !room.isRoomPrivate;
    });
    res.send(validRooms);
  } catch(err) {
    console.log('error in retrieving rooms: ' + err);
    res.send(new Set<string>());
  }
});

/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/build', 'index.html'));
});
*/

server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
