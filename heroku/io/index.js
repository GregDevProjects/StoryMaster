var app = require('express')();
require('http-shutdown').extend();
var http = require('http').Server(app).withShutdown();
var io = require('socket.io')(http);
var port = 4000;

module.exports = {
    listen : listen,
    io : io,
    broadcastToRoomId : broadcastToRoomId
}

function listen() {
    http.listen(port, function(){
        console.log('listening on *:' + port);
    });
    return http;
}

function broadcastToRoomId(roomId, status, message = null ) {
    io.to(roomId).emit(status, message);
}