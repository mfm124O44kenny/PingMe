// importation de modules
import {Server} from 'socket.io';
import {createServer} from 'http';
import express from 'express';

/* ===============================
   Constantes
   =============================== */
const app = express();
const httpServer = createServer(app);
const HOST = process.env.HOST;
const io = new Server(httpServer, {
    cors: {
        //origin: [`http://localhost:5173`]
        origin: "*", // Autoriser tout en développement
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// uilisé pour stocker les utilisateurs en ligne
const userSocketMap = {}  // {userId: socketId}
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('✅ L\'user [' + userId + '] est connecté !');

    if(userId) userSocketMap[userId] = socket.id;
    // io.emit est utilisé pour envoyé un event à tous les users connectés (send online users to all clients)
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('⛔ L\'user [' + userId + '] n\'est plus connecté !');
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
    
})

export {app, io, httpServer};