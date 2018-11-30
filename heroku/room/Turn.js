round = require('./Round');
//BUG -> can't accept writings at 0
exports.Turn = function Turn(io, roomId) { 
    this._io = io;
    this._turnStatus;
    this._roomId = roomId;
    this._round = 1;
    this._rounds = [];
    this.turnsHaveStarted = false;
    this.isPaused = false;

    this.reset = function() {
        this.isPaused = false;
        this._stopTimer();
        //TODO: add logic to clear rounds here
    }

    this.startTurns = function() {
        this.turnsHaveStarted = true;
        this.currentRound = new round.Round(this._round);
        this._startWritingTimer();
    }
    
    this.pauseTurns = function() {
        this._stopTimer();
        this._broadcastPause();
        this.isPaused = true;
    }

    this.resumeTurns = function() {
        this.isPaused = false;
        //TODO: add method for resuming turns
        this.startTurns();
    }

    this.onWritingReceived = function(user, message) {
        if (this._turnStatus != TurnStatus.WRITING) {
            return;
        }
        this.currentRound.addWriting(user, message);
    }

    this._startWritingTimer = async function() {
        this._turnStatus = TurnStatus.WRITING;
        await this._broadcastCountdown(TurnStatus.WRITING, SECONDS_TO_WRITE);
        console.log(
            'w finished',  this.currentRound.writings
        )
        this._turnStatus = TurnStatus.VOTING;
        await this._broadcastCountdown(TurnStatus.VOTING, SECONDS_TO_VOTE);
        console.log(
            'v finished'
        )  
    }

    this._broadcastPause = function() {
        this._io.to(this._roomId).emit(
            'waiting', 
            'Not enough players to continue, waiting for another...'
        );    
    }

    this._broadcastCountdown = function(type, seconds) {
        return new Promise((resolve, reject) => {
            this.countdown = seconds;
            this.turnTimer = setInterval(function() { 
                if (this.countdown <= 0) {
                    this._stopTimer();
                    resolve();
                }
                
                this._io.to(this._roomId).emit('turnTimer', {
                    seconds: this.countdown,
                    type: type
                });
                this.countdown--;
            }.bind(this), 1000);
        })
    }

    this._stopTimer = function() {
        //console.log('timer_stopped')
        clearInterval(this.turnTimer);
    }
}

const TurnStatus = {
    WRITING: 1,
    VOTING: 2
}

const SECONDS_TO_WRITE = 15;
const SECONDS_TO_VOTE = 10;