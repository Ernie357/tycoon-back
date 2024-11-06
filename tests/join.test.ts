import join from '../src/socketEventHandlers/join';
import { createServer } from "http";
import { Server } from 'socket.io';
import { io as ioClient } from "socket.io-client";
import { GameState, UserSocket } from '../src/types';

describe("Join Room Socket Event Handler", () => {
    const roomCode = "12345";
    const playerDetails = [
        { name: "john", image: "image1.png" },
        { name: "jane", image: "image2.png" },
        { name: "doe", image: "image3.png" },
        { name: "smith", image: "image4.png" },
        { name: "spectator1", image: 'image5.png' },
        { name: "spectator2", image: 'image6.png' }
    ];
    let io: any;
    let serverSocket: UserSocket;
    let clientSockets: any[] = [];

    beforeEach((done) => { 
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const address = httpServer.address();
            if (typeof address === 'object' && address !== null) {
                const port = address.port;

                // Create multiple client sockets
                for (let i = 0; i < playerDetails.length; i++) {
                    const clientSocket = ioClient(`http://localhost:${port}`);
                    clientSockets.push(clientSocket);
                    clientSocket.on('error', () => {
                        console.log(`there was an error with socket #${i + 1}`);
                        done();
                    });
                }

                // Set up connection for the serverSocket
                io.on("connection", (socket: UserSocket) => {
                    serverSocket = socket;

                    // Here you can set up the event handler
                    serverSocket.on("join", (roomCode: string, playerName: string, playerImage: string) => {
                        join(roomCode, playerName, playerImage, serverSocket, io);
                    });

                    // Call done here to indicate that the server setup is complete
                    console.log('server is ready, loading test');
                    done();
                });
            }
        });
    });

    afterEach((done) => {
        console.log('finished test, moving on to next');
        io.close();
        clientSockets.forEach(socket => socket.disconnect());
        done();

    });

    it("Should allow the first player to join the room", (done) => {
        clientSockets[0].connect();
        clientSockets[0].on('connect', () => {
            clientSockets[0].emit("join", roomCode, playerDetails[0].name, playerDetails[0].image);
        });
        clientSockets[0].on("new join", (gameState) => {
            expect(gameState).toBeDefined();
            expect(gameState.users.length).toBe(1);
            expect(gameState.users[0].name).toBe("john");
            expect(gameState.users[0].image).toBe("image1.png");
            done();
        });
    });

    it("Should allow four players to join the room", (done) => {
        jest.setTimeout(50000);
        const joinPromises = [];
        const expectedPlayers = playerDetails.slice(0, 4); // Ensure you have at least 4 players in playerDetails
    
        // Connect all 4 players
        for (let i = 0; i < 4; i++) {
            const playerPromise = new Promise((resolve) => {
                clientSockets[i].connect();
                clientSockets[i].on('connect', () => {
                    clientSockets[i].emit("join", roomCode, expectedPlayers[i].name, expectedPlayers[i].image);
                });
    
                clientSockets[i].on("new join", (gameState) => {
                    expect(gameState).toBeDefined();
                    resolve(gameState); // Resolve the promise with the game state
                });
            }) as never;
            joinPromises.push(playerPromise);
        }
    
        Promise.all(joinPromises).then((gameStates: GameState[]) => {
            // After all players have joined, check the final game state
            const finalGameState = gameStates[gameStates.length - 1];
            expect(finalGameState.users.length).toBe(4);
            
            // Verify the details of each user
            expectedPlayers.forEach((player, index) => {
                expect(finalGameState.users[index].name).toBe(player.name);
                expect(finalGameState.users[index].image).toBe(player.image);
            });
    
            done();
        }).catch((error) => {
            console.error("Error joining players:", error);
            done.fail(error); // Fail the test if there’s an error
        });
    });

    /*
    it("Should allow for spectators past 4 players", () => {
        playerDetails.forEach((player, index) => {
            clientSockets[index].emit("join", roomCode, player.name, player.image);
        });
    });

    it("Should stop more than 8 people from joining", () => {

    });
    */
});