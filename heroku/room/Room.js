var uniqid = require('uniqid');
var turn = require('./Turn')

function Room(io) {
    this.id = uniqid();
    this._io = io;
    this._turns = new turn.Turn(this._io, this.id);

    this._getClientCount = function () {
       return new Promise((resolve, reject) => {
            this._io.in(this.id).clients((err, clients) => {
                if (err) {
                    reject(err);
                }
                resolve(clients.length);
            });       
        }) 
    }
    this.join = async function (socket) {
        socket.join(this.id);
        socket.on('msg', (data) => {
            //console.log(data);
            this._turns.onWritingReceived(socket.id, data);
        })
        this._broadcastWaitingStatus();
    }
    //TODO: refactor, the name of this function is misleading
    this._broadcastWaitingStatus = async function() {
        if (await this.isAnotherPlayerNeeded()) {
            const message = this._turns.isPaused ? 
                'Not enough players to continue, waiting for another...' : 
                'connected to room, waiting for players';
            io.to(this.id).emit('waiting', message);
            return;
        } 
        this._io.to(this.id).emit('waiting', 'connected to room, game starting');
        this._startTurn();
    }
    this._startTurn = function() {
        if (!this._turns.turnsHaveStarted) {
            this._turns.startTurns();
            return;
        }
        this._turns.resumeTurns();
    }
    this.onUserDisconnect = async() => {
        if (await this._getClientCount() >= MIN_USERS_IN_ROOM) {
            return;
        }
        this._turns.pauseTurns();

    }
    this.isAnotherPlayerNeeded = async function () {
        return await this._getClientCount() < MAX_USERS_IN_ROOM;
    }
}

const MAX_USERS_IN_ROOM = 3;
const MIN_USERS_IN_ROOM = 3;

module.exports = {
    Room: Room,
    MAX_USERS_IN_ROOM: MAX_USERS_IN_ROOM
}

