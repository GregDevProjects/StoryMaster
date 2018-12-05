const Lobby = require('../lobby/Lobby').Lobby; 
const ioHandler = require('../io/index');

module.exports = {
    startIoAndLobby : startIoAndLobby,
    startIntervalDebugging : startIntervalDebugging
}

function startIoAndLobby(){
    const http = ioHandler.listen();
    const lobby = new Lobby(ioHandler.io);
    lobby.createRoom();
    lobby.assignClientsOnConnectAndDisconnect();
    return { 
        http: http,
        lobby: lobby
    }
}

function startIntervalDebugging(lobby){
    setInterval( function() {
        console.log('ROOMS: '+ lobby._rooms.length);
        lobby._rooms.forEach((aRoom) => { 
            aRoom._getClientCount().then(function(resolve, reject) {
                console.log(
                    'ROOM ' + aRoom.id  +' : ' + resolve
                );
            })
        })
    } , 2000)
}