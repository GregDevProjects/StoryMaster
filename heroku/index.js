var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const lobbyHandler = require('./lobby/index'); 

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const lobby = lobbyHandler.createLobby(io)

lobby.initLobby();
lobby.assignClientsOnConnectAndDisconnect();

setInterval( function() {
    console.log('ROOMS: '+ lobby._rooms.length);
    lobby._rooms.forEach((aRoom) => { 
        aRoom._getClientCount().then(function(resolve, reject) {
            console.log('ROOM ' + aRoom.id  +' : ' + resolve);
        })
    })
} , 2000)

http.listen(port, function(){
  console.log('listening on *:' + port);
});

