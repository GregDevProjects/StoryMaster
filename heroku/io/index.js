var app = require('express')();
require('http-shutdown').extend();
var http = require('http').Server(app).withShutdown();
var io = require('socket.io')(http);
var port = 3000;

exports.listen = () => {
    http.listen(port, function(){
        console.log('listening on *:' + port);
    });
    return http;
}

exports.io = io;

exports.broadcastToRoomId = (roomId, status, message = null ) => {
    io.to(roomId).emit(status, message);
}