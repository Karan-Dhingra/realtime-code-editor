require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ACTION = require('./constants')
const cors = require('cors')
const { Server } = require('socket.io')
const PORT = 8000
const SOCKET_PORT = 8001

const io = new Server({
    cors: true,
})
const app = express()

app.use(bodyParser.json())
app.use(cors())

const socketToUsernameMapping = new Map()

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: socketToUsernameMapping.get(socketId)
        }
    })
}

io.on('connection', (socket) => {
    console.log(`Socket Connection: ${socket.id}`)

    socket.on(ACTION.JOIN, ({roomId, username}) => {
        socketToUsernameMapping.set(socket.id, username)
        socket.join(roomId)

        const clients = getAllConnectedClients(roomId)
        clients.forEach(({socketId}) => {
            io.to(socketId).emit(ACTION.JOINED, {clients, username, socketId: socketId.id})
        })
    })

    socket.on(ACTION.CODE_CHANGE, ({roomId, code}) => {
        socket.in(roomId).emit(ACTION.CODE_CHANGE, {roomId, code})
    })

    socket.on(ACTION.SYNC_CODE, ({socketId, code}) => {
        io.to(socketId).emit(ACTION.CODE_CHANGE, {code})
    })

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTION.DISCONNECTED, {socketId: socket.id, username: socketToUsernameMapping.get(socket.id)})
        })

        socketToUsernameMapping.delete(socket.id)
        socket.leave()
    })
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})
io.listen(SOCKET_PORT)