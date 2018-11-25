var roomHandler = require('../room/index');
var array = require('lodash/array');

function Lobby(io) {
    this._rooms = [];
    this._io = io;
    this.createRoom = function () {
        const newRoom = roomHandler.createRoom(this._io);
        this._rooms.push(
            newRoom
        )
        return newRoom;
    }
    this.assignClientsOnConnectAndDisconnect = function () {
        this._io.on('connection', async (socket) => {
            const room = await this._getRoomForClient();
            this._broadcastConnectedToRoom(socket.id);
            room.join(socket);
            socket.on('disconnecting', async () => { 
                
                const roomWasDeleted = await this._deleteRoomIfNoClients(socket);
                if (!roomWasDeleted) {
                    room.onUserDisconnect();
                }
            });          
        });
    }
    this._broadcastConnectedToRoom = function(roomId) {
        io.to(roomId).emit('waiting', 'connected');
    }
    //TODO: refactor, it's too large and I'm not sure if we need to put the rooms to delete in an array
    this._deleteRoomIfNoClients = (socket) => {
        return new Promise(async (resolve, reject) => {
            const roomIdsToDelete = [];
            const idOfRoom = this._getRoomIdOfSocket(socket)[0];
            for (const [index, value] of this._rooms.entries()) {
                if (value.id != idOfRoom) {
                    continue;
                }
                if (
                    await value._getClientCount() -1 <= 0 &&
                    this._rooms.length > 1
                ) {
                    roomIdsToDelete.push(value.id);
                }  
            }
            if (roomIdsToDelete.length <= 0) {
                resolve(false);
            }
            array.remove(this._rooms,(aRoom)=>{
                return roomIdsToDelete.includes(aRoom.id);
            })
            resolve(true);
        })
    }
    this._getRoomIdOfSocket = function(socket) {
        return Object.keys(socket.rooms)
            .filter(item => item!=socket.id);
    }
    this._getRoomForClient = async function () {
        for (const aRoom of this._rooms) {
            if (await aRoom.isAnotherPlayerNeeded()) {
                return (aRoom);
            }
        }
        return this.createRoom();
    }

}

module.exports = {
    Lobby: Lobby
}
