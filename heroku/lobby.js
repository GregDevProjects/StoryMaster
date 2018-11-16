

exports.watchLobby = function(io) {
    console.log('heml')
    ioGlobal = io;
    var nsp = io.of('/lobby');
    nsp.on('connection', function(socket){
      console.log('someone connected to lobbyss');
      console.log( io.of('/lobby').clients())
    });
}

exports.getTotalClients = function(io) {
    io.of('/lobby').clients();
}