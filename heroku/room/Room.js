var uniqid = require('uniqid');
var turn = require('./turn/Turn')
var broadcastToRoomId = require('../io/index').broadcastToRoomId;
var user = require('./User').User;
var _ = require('lodash');

const MAX_USERS_IN_ROOM = 5;
const MIN_USERS_IN_ROOM = 3;
const GAME_START_MESSAGE = "GS";
const GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE = 'WTS';
const GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE = 'WTC';



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
    this._users = [];
    this._turns = new turn.Turn(this.id, this._users);

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
        
        socket.on('msg', async (data) => {
            const userThatWrote = _.find(this._users, function(aUser) { return aUser.socketId == socket.id; });
            if (!userThatWrote || !userThatWrote.isApprovedToPlayInTurns) {
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
            if (!userThatVoted || !userThatVoted.isApprovedToPlayInTurns) {
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
            const newUser = new user(socket.id, userName);
            this._users.push(newUser);
            this._broadcastWaitingStatusOrStartTurns(newUser);
        }
    }
    this._broadcastWaitingStatusOrStartTurns = async function(newUser) {
        if (await this._isEnoughUsersToStart()) {
            this._startOrResumeTurns(newUser);
            return;
        } 
        if (this._turns.isPaused) {
            broadcastToRoomId(newUser.socketId, 'error', GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE);
            this._broadcastPlayersNeededToStart();
            return;
        }
        broadcastToRoomId(newUser.socketId, 'waiting', GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE);
        this._broadcastPlayersNeededToStart();

    }


    this._startOrResumeTurns = function(newUser) {
        
        if (!this._turns.turnsHaveStarted) {
            //game starts for the first time
            broadcastToRoomId(this.id, 'waiting', GAME_START_MESSAGE);
            this._users.forEach(aUser => {aUser.isApprovedToPlayInTurns = true;});
            this._turns.startTurns();
            return;
        }
        if (this._users.length <= MIN_USERS_IN_ROOM) {
            //the minimum users required to play was just met, restart round  
            broadcastToRoomId(this.id, 'waiting', GAME_START_MESSAGE);
            
            this._users.forEach(aUser => {aUser.isApprovedToPlayInTurns = true;});
            this._turns.resumeTurns();
            return;
        }
        //round is already in progress, make new player wait until its over
        broadcastToRoomId(newUser.socketId, 'waitingRoundFinish', this._turns._story);
        newUser.isApprovedToPlayInTurns = false;
    }
    this.onUserDisconnect = async(socket) => {
        this.removeUser(socket.id);
        this._turns.removeUserFromRoundWinners(socket.id);
        const usersInRoom = await this._getClientCount();
        if (usersInRoom >= MIN_USERS_IN_ROOM) {
            return;
        }

        if (usersInRoom <= 0) {
            //no users left, restart the game
            this._turns.reset();
            return;
        }
        this._turns.pauseTurns();
        broadcastToRoomId(
            this.id,
            'error',
            GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE
        );
        this._broadcastPlayersNeededToStart();
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
    this._broadcastPlayersNeededToStart = () => {
        console.log(MIN_USERS_IN_ROOM - this._users.length);
        broadcastToRoomId(
            this.id,
            'playersNeeded',
            MIN_USERS_IN_ROOM - this._users.length
        );
    }
}