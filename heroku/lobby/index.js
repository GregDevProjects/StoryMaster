var Lobby = require('./Lobby');

exports.createLobby = function(io) {
    return new Lobby.Lobby(io);
}