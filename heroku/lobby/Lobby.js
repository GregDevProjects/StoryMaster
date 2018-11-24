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
            room.join(socket);

            socket.on('disconnecting', () => {
                
                this._deleteRoomIfNoClients(socket);
            });
        });
    }
    this._deleteRoomIfNoClients = async function(socket) {
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
        array.remove(this._rooms,(aRoom)=>{
            return roomIdsToDelete.includes(aRoom.id);
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
