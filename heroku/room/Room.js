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
        //console.log('joined');
        socket.join(this.id);
        socket.on('msg', (data) => {
            //console.log(data);
            this._turns.onWritingReceived(socket.id, data);
        })
        this._broadcastWaitingStatus(socket.id);
    }
    //TODO: refactor, the name of this function is misleading. Sometimes it broadcasts to room or individual
    this._broadcastWaitingStatus = async function(newUserId) {
        if (await this._isEnoughUsersToStart()) {
            const message = this._turns.isPaused ? 
                GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE : 
                GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE;
            io.to(newUserId).emit('waiting', message);
            return;
        } 
        this._io.to(this.id).emit('waiting', GAME_START_MESSAGE);
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
        const usersInRoom = await this._getClientCount();
        if (usersInRoom >= MIN_USERS_IN_ROOM) {
            return;
        }

        if (usersInRoom <= 0) {
            this._turns.reset();
            return;
        }
        this._turns.pauseTurns();

    }
    this.canAnotherUserJoin = async () => {
        return await this._getClientCount() < MAX_USERS_IN_ROOM;
    }
    this._isEnoughUsersToStart = async () => {
        return await this._getClientCount() < MIN_USERS_IN_ROOM;
    }
}

const MAX_USERS_IN_ROOM = 5;
const MIN_USERS_IN_ROOM = 3;
const GAME_START_MESSAGE = "connected to room, game starting";
const GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE = 'Not enough players to start, waiting for another...';
const GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE = 'Not enough players to continue, waiting for another...';

module.exports = {
    Room: Room,
    MAX_USERS_IN_ROOM: MAX_USERS_IN_ROOM,
    GAME_START_MESSAGE: GAME_START_MESSAGE,
    MIN_USERS_IN_ROOM: MIN_USERS_IN_ROOM,
    GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE: GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE,
    GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE: GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE
}

