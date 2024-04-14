const Server = require("socket.io").Server;
const http = require("http");
const Express = require("express");

const app = Express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

const userSocketMap = {}; // { userID: socketID}

const getRecieverSocketId = (recieverId) => {  
    return userSocketMap[recieverId];
}

const getSenderSocketId = (senderId) => {
    return userSocketMap[senderId];
}

// const getMessageSocketId = (messageId) => {
//     return userSocketMap[messageId];
// }

io.on("connection", (socket) => {
    console.log("a user connected");
    const  userId  = socket.handshake.query.userId;
    if (userId != "undefined") {
        userSocketMap[userId] = socket.id;
    }
    //io.emit is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    //socket.on is used to listen to the event sent by the client can be used both on server and client side
    socket.on("disconnect", () => {
        console.log("user disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
    });
});



module.exports = { app, io, server, getRecieverSocketId, getSenderSocketId }; 