

import * as ecstatic from 'ecstatic';
//let ecstatic = require('ecstatic') //static file server middleware
let server = require('http').createServer(
  ecstatic({ root: __dirname, handleError: false })
)
let p2pserver = require('socket.io-p2p-server').Server //set up p2p server
let io = require('socket.io')(server)   //pass server and serveClient option (default true?)

var socket_rooms = {}  //rooms initialized (empty) 


server.listen(4000, function () {
  console.log('Listening on 4000')
})

//io.use(p2pserver)

io.on('connection', function (socket) {
  socket.on('join-room', function(roomName) {
    //socket.on takes in an event name(string), and a callback (function), and returns type Socket
    console.log("Currently in rooms:", socket.rooms) 
    //socket.rooms is a hash of rooms identifiying the rooms the client is in 
    console.log("\treceived request to join room: ", roomName)
    socket.join(roomName)
    console.log("\t\tclients for room: ", {name: roomName})
    p2pserver(socket, null, {name:roomName})
    socket_rooms[socket.id] = roomName      //socket.id is unique identifier for current session
  })

  socket.on('peer-msg', function (data) {
    console.log('Message from peer: %s', data)
    socket.broadcast.to(socket_rooms[socket.id]).emit('peer-msg', data) 
    //broadcast only to clients that have joined the given room
    //emit fires an event
  })

  socket.on('peer-file', function (data) {
    console.log('File from peer: %s', data)
    socket.broadcast.to(socket_rooms[socket.id]).emit('peer-file', data)
  })

  socket.on('go-private', function (data) {
    socket.broadcast.to(socket_rooms[socket.id]).emit('go-private', data)
  })

  socket.on('disconnect', function () {
      console.log('user disconnected from server');
      //server is receiving the signal on client disconnect :)
  })
})