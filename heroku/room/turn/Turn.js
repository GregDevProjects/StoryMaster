var round = require('../Round');
var broadcastToRoomId = require('../../io/index').broadcastToRoomId;

const TurnStatus = {
    WRITING: 1,
    VOTING: 2,
    DISPLAYING_INFO: 3
}

const SECONDS_TO_WRITE = 15;
const SECONDS_TO_VOTE = 10;
const SECONDS_TO_SHOW_ROUND_RESULTS = 5;

exports.TurnStatus = TurnStatus;
exports.Turn = function Turn(io, roomId) { 
    this._io = io;
    this._turnStatus;
    this._roomId = roomId;
    this._round = 1;
    this._rounds = [];
    this.turnsHaveStarted = false;
    this.isPaused = false;
    this._allUsersFinished = false;
    //for when all users leave a room 
    //this will only be called by the only room left, otherwise the room will be destroyed 
    this.reset = function() {
        this.isPaused = false;
        this._stopTimer();
        //TODO: add logic to clear rounds here
    }

    this.startTurns = function() {
        this.turnsHaveStarted = true;
        this.currentRound = new round.Round(this._round);
        this._doARound();
    }
    
    this.pauseTurns = function() {
        this._stopTimer();
        broadcastToRoomId(
            this._roomId, 
            'waiting', 
            'Not enough players to continue, waiting for another...'
        );
        this.isPaused = true;
    }

    //when restarting after a player leaves and another joins 
    this.resumeTurns = function() {
        this._stopTimer();
        this.isPaused = false;
        //TODO: add method for resuming turns
        this.startTurns();
    }

    this.onWritingReceived = function(user, message, clientCount) {
        if (this._turnStatus != TurnStatus.WRITING) {
            return;
        }
        this.currentRound.addWriting(user, message);
        if (!this._haveAllUsersFinishedWriting(clientCount)) {
            return;    
        }
        this._stopTimer()
        this.stopTimerEarly();
    }

    this.onVoteReceived = function(user, vote, clientCount) {
        if (this._turnStatus != TurnStatus.VOTING) {
            return;
        }
        this.currentRound.addVote(user, vote);  
        if (!this._haveAllUsersFinishedVoting(clientCount)) {
            return;
        }    
        this._stopTimer()
        this.stopTimerEarly();   
    }

    this._haveAllUsersFinishedVoting = function(clientsInRoom) {
        return clientsInRoom == this.currentRound.votes.length;
    }

    this._haveAllUsersFinishedWriting = function(clientsInRoom) {
        return clientsInRoom == this.currentRound.writings.length;
    }

    this._doARound = async function() {
        this._turnStatus = TurnStatus.WRITING;
        await this._broadcastCountdown(TurnStatus.WRITING, SECONDS_TO_WRITE);

        this._turnStatus = TurnStatus.VOTING;
        this._broadcastVoteStart();
        await this._broadcastCountdown(TurnStatus.VOTING, SECONDS_TO_VOTE);

        this._turnStatus = TurnStatus.DISPLAYING_INFO;
        broadcastToRoomId(
            this._roomId, 
            'roundOver', 
            this.currentRound.getRoundResultsWithWinner()
        );

        await this._broadcastCountdown(TurnStatus.DISPLAYING_INFO, SECONDS_TO_SHOW_ROUND_RESULTS);
    }

    //can't broadcast a writing to the same user that wrote it 
    //TODO: refactor, there's 3 loops in this function :(
    this._broadcastVoteStart = () => {
        const broadcasts = [];
        this.currentRound.writings.forEach(aWriting1 => {
            const aBroadcast = {socketId: aWriting1.user, writings: []};
            this.currentRound.writings.forEach(aWriting2 => {
                if (aWriting1.user != aWriting2.user ) {
                    aBroadcast.writings.push({
                        user : aWriting2.user,
                        message : aWriting2.message
                    })
                }
            });     
            broadcasts.push(aBroadcast)
        });

        broadcasts.forEach((aBroadcast) => {
            broadcastToRoomId(aBroadcast.socketId, 'vote', aBroadcast.writings);
        });
    }

    this._broadcastCountdown = function(type, seconds) {
        return new Promise((resolve, reject) => {
            this.stopTimerEarly = resolve;
            this.countdown = seconds;
            this.turnTimer = setInterval(() => { 
                if (this.countdown <= 0) {
                    this._stopTimer();
                    resolve();
                }
                broadcastToRoomId(
                    this._roomId, 
                    'turnTimer', 
                    {
                        seconds: this.countdown,
                        type: type
                    }
                );

                this.countdown--;
            }, 1000);
        })
    }

    this._stopTimer = function() {
        clearInterval(this.turnTimer);
    }
}