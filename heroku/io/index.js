var app = require('express')();
require('http-shutdown').extend();
var http = require('http').Server(app).withShutdown();
var io = require('socket.io')(http);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 7000;
}
console.log('PORT', port)
app.listen(7000);

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