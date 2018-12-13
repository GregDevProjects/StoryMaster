var uniqid = require('uniqid');
var turn = require('./turn/Turn')
var broadcastToRoomId = require('../io/index').broadcastToRoomId;
var user = require('./User').User;
var _ = require('lodash');

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

function Room(io) {
    this.id = uniqid();
    this._io = io;
    this._turns = new turn.Turn(this._io, this.id);
    this._users = [];

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
    this.join = async function (socket, userName) {
        
        this._addUserIfNew(socket, userName);
        
        //console.log(this._users.length);
        socket.on('msg', async (data) => {
            const userThatWrote = _.find(this._users, function(aUser) { return aUser.socketId == socket.id; });
            if (!userThatWrote) {
                return;
            }
            this._turns.onWritingReceived(
                userThatWrote, 
                data, 
                await this._getClientCount()
            );
        });
        socket.on('vote', async (data) => {
            const userThatVoted = _.find(this._users, function(aUser) { return aUser.socketId == socket.id; });
            if (!userThatVoted) {
                return;
            }
            this._turns.onVoteReceived(
                userThatVoted, 
                data, 
                await this._getClientCount()
            );
        });
        
    }
    this._addUserIfNew = (socket, userName) => {
        const userIsAlreadyInRoom = _.find(this._users, function(aUser) { return aUser.socketId == socket.id; });
        if (!userIsAlreadyInRoom) {
            socket.join(this.id);
            this._users.push(new user(socket.id, userName));
            this._broadcastWaitingStatusOrStartTurns(socket.id);
        }
    }
    this._broadcastWaitingStatusOrStartTurns = async function(newUserId) {
        if (await this._isEnoughUsersToStart()) {
            this._startOrResumeTurns();
            return;
        } 
        this._broadcastWaitMessage(newUserId);
    }
    this._broadcastWaitMessage = function(newUserId) {
        const message = this._turns.isPaused ? 
            GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE : 
            GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE;
        broadcastToRoomId(newUserId, 'waiting', message);
    }

    this._startOrResumeTurns = function() {
        broadcastToRoomId(this.id, 'waiting', GAME_START_MESSAGE);
        if (!this._turns.turnsHaveStarted) {
            this._turns.startTurns();
            return;
        }
        this._turns.resumeTurns();
    }
    this.onUserDisconnect = async(socket) => {
        this.removeUser(socket.id);
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
    this.removeUser = (socketId) => {
        _.remove(this._users, function(aUser) {
            return aUser.socketId == socketId;
        });
    }

    this.canAnotherUserJoin = async () => {
        return await this._getClientCount() < MAX_USERS_IN_ROOM;
    }
    this._isEnoughUsersToStart = async () => {
        return await this._getClientCount() >= MIN_USERS_IN_ROOM;
    }
}