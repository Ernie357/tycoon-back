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

dotenv.config();

interface UserSocket extends Socket {
  user: User,
  gameState: GameState
}

const app: Express = express();
const frontUrl = process.env.FRONT_URL || "https://personatycoon.netlify.app";

app.use(cors({
  origin: frontUrl
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: frontUrl
  }
});
//app.use(express.static(path.join(__dirname, '../front/build')));

const activeRoomCodes = new Set<string>();

io.on('connection', (socket: UserSocket) => {
  socket.on('join', (roomCode: string, playerName: string, playerImage: string) => {
    join(roomCode, playerName, playerImage, socket, io);
  });
  socket.on('leave', (roomCode: string) => {
    leave(roomCode, activeRoomCodes, socket, io);
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
    try {
      console.log(`${socket.user.name} disconnected.`);
      for (const room of socket.rooms) {
        socket.leave(room);
        leave(room, activeRoomCodes, socket, io);
        console.log(`Socket ${socket.user.name} left room ${room} on disconnect.`);
      }
      socket.disconnect();
    } catch(err) {
      console.log('There was an error disconnecting a socket: ' + err);
    }
  });
});

app.get('/roomcode', (req: Request, res: Response) => {
  try {
    let code: string;
    do {
        code = Math.floor(10000 + Math.random() * 90000).toString();
    } while (activeRoomCodes.has(code));
    activeRoomCodes.add(code); 
    res.send(code);
  } catch(err) {
    console.log('error in generating random room code: ' + err);
    res.send(null);
  }
});

app.get('/isRoomCodeValid', (req: Request, res: Response) => {
  try {
    const code = req.query.roomCode.toString();
    if(activeRoomCodes.has(code)) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch(err) {
    console.log('error in checking to see if room code is valid: ' + err);
    res.send(false);
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
