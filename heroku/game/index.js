const lobbyHandler = require('../lobby/index'); 
const ioHandler = require('../io/index');

exports.startIoAndLobby = () => {
    const http = ioHandler.listen();
    const lobby = lobbyHandler.createLobby(ioHandler.io)
    lobby.createRoom();
    lobby.assignClientsOnConnectAndDisconnect();
    return { 
        http: http,
        lobby: lobby
    }
}

exports.startIntervalDebugging = (lobby) => {
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