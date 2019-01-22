const Lobby = require('../lobby/Lobby').Lobby; 
const ioHandler = require('../io/index');
const os = require('os');

module.exports = {
    startIoAndLobby : startIoAndLobby,
    startIntervalDebugging : startIntervalDebugging,
    startCpuUsageLogs : startCpuUsageLogs
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

function startCpuUsageLogs() {
    setInterval( function() {
        // console.log(os.cpus());
        // console.log(os.totalmem());
        // console.log(os.freemem());
        console.log(os.freemem()/os.totalmem());
    } , 2000)
}
