var Room = require('./Room')

exports.createRoom = function(io) {
    return new Room.Room(io);
}