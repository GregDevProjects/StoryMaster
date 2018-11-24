var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

exports.listen = () => {
    http.listen(port, function(){
        console.log('listening on *:' + port);
    });
    return http;
}

exports.io = io;