require("dotenv").config()
const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const socket = require("socket.io")
const io = socket(server)

const users = {}

const socketToRoom = {}

io.on("connection", (socket) => {
  socket.on("join room", (roomId) => {
    if (users[roomId]) {
      const length = users[roomId].length
      if (length === 2) {
        socket.emit("room full")
        return
      }
      users[roomId].push(socket.id)
    } else {
      users[roomId] = [socket.id]
    }
    socketToRoom[socket.id] = roomId
    const usersInThisRoom = users[roomId].filter((id) => id !== socket.id)

    socket.emit("all users", usersInThisRoom)
  })

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    })
  })

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    })
  })

  socket.on("disconnect", () => {
    const roomId = socketToRoom[socket.id]
    let room = users[roomId]
    if (room) {
      room = room.filter((id) => id !== socket.id)
      users[roomId] = room
    }

    socket.broadcast.emit("user left", socket.id)
  })
})

server.listen(process.env.PORT || 8000, () => console.log("server is running on port 8000"))
