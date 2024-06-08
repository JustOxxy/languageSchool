require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const usersInRooms = {};

const socketToRoom = {};

io.on("connection", (socket) => {
  socket.on("join room", (roomId, userId) => {
    if (!usersInRooms[roomId]) {
      usersInRooms[roomId] = [];
    }

    const usersAmount = usersInRooms[roomId].length;

    if (usersAmount === 2) {
      socket.emit("room full");
      return;
    }

    const roomUsers = usersInRooms[roomId];
    const existingUser = roomUsers.find((user) => user.userId === userId);

    if (existingUser) {
      // need to close old tab
      io.to(existingUser.socketId).emit("disconnect old tab");
      // update socketId for existing user
      existingUser.socketId = socket.id;
    } else {
      // add new user into room
      roomUsers.push({ userId, socketId: socket.id });
    }

    socketToRoom[socket.id] = roomId;
    const socketList = roomUsers.map((user) => user.socketId);
    const usersInThisRoom = socketList.filter((id) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerId: payload.callerId,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomId = socketToRoom[socket.id];
    const roomUsers = usersInRooms[roomId];
    if (!roomUsers) return;

    usersInRooms[roomId] = roomUsers.filter((user) => user.socketId !== socket.id);

    if (usersInRooms[roomId].length === 0) {
      delete usersInRooms[roomId];
    }
    socket.broadcast.emit("user left", socket.id);
  });
});

server.listen(process.env.PORT || 8000, () => console.log("server is running on port 8000"));
