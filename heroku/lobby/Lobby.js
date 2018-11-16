var roomHandler = require('../room/index');

function Lobby(io) {
    this._rooms = [];
    this._io = io;
    this.initLobby = function () {
        this._rooms.push(
            roomHandler.createRoom(this._io)
        )
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
        const idOfRoom = this._getRoomIdOfSocket(socket);
        for (const [index, value] of this._rooms.entries()) {
            if(value.id != idOfRoom) {
                continue;
            }
            if (
                await value._getClientCount() -1 <= 0 &&
                this._rooms.length > 1
            ) {
                this._rooms.splice(index, 1);
            }  
        }
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
        const newRoom = roomHandler.createRoom(this._io);
        this._rooms.push(newRoom);
        return (newRoom);
    }

}

module.exports = {
    Lobby: Lobby
}
