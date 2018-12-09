//sets and broadcasts the state of the game, gets user input and records it in a round
//handles:
//1. users finishing turns 
//2. users leaving/joining 
var round = require('./Round');
var broadcastToRoomId = require('../../io/index').broadcastToRoomId;
var timerBroadcaster = require('./CountdownTimer').TimerBroadcaster;
var _ = require('lodash/collection');

const TurnStatus = {
    WRITING: 1,
    VOTING: 2,
    DISPLAYING_INFO: 3
}

const SECONDS_TO_WRITE = 15;
const SECONDS_TO_VOTE = 10;
const SECONDS_TO_SHOW_ROUND_RESULTS = 5;

module.exports = {
    TurnStatus : TurnStatus,
    Turn : Turn
}

function Turn(io, roomId) { 
    this._io = io;
    this._turnStatus;
    this._roomId = roomId;
    this._round = 1;
    this._rounds = [];
    this.turnsHaveStarted = false;
    this.isPaused = false;
    this._allUsersFinished = false;
    this._story = '';
    this._roundWinners = []; 

    this._timerBroadcaster = new timerBroadcaster(this._roomId);
    //for when all users leave a room 
    //this will only be called by the only room left, otherwise the room will be destroyed when all users leave
    this.reset = function() {
        this.isPaused = false;
        this._timerBroadcaster.stopTimerWithoutResolving();
        //TODO: add logic to clear rounds here
    }

    this.startTurns = async function() {
        this.turnsHaveStarted = true;
        for(let i = 0; i < 10; i++) {
            this.currentRound = new round.Round(this._round);
            const roundResults = await this._doARound();
            //FAILS HERE IF NO WRITINGS
            this._story += (' ' + roundResults.winner.message);
            this._roundWinners.push(roundResults.winner.user);
            //TODO: this is messy because _.countBy returns an object, need to find a better way to do this
            a = _.countBy(this._roundWinners, function(o){
                return o.socketId
            })


            let winArray = [];

            for (var key in a) {
                const name = this._roundWinners.find(function(yo){
                    return yo.socketId == key;
                }).name
                const score = a[key];
                winArray.push({name, score});
            }

            broadcastToRoomId(
                this._roomId, 
                'results', 
                {    
                    story:this._story, 
                    score: winArray
                }
            );
            await this._timerBroadcaster.start(TurnStatus.DISPLAYING_INFO, SECONDS_TO_SHOW_ROUND_RESULTS);
        }

    }

    this._doARound = () => {
        return new Promise(async (resolve, reject) => {
            this._turnStatus = TurnStatus.WRITING;
            await this._timerBroadcaster.start(TurnStatus.WRITING, SECONDS_TO_WRITE);

            this._turnStatus = TurnStatus.VOTING;
            this._broadcastVoteStart();
            await this._timerBroadcaster.start(TurnStatus.VOTING, SECONDS_TO_VOTE);

            this._turnStatus = TurnStatus.DISPLAYING_INFO;
            const winResults = this.currentRound.getRoundResultsWithWinner();
            //console.log(winResults)
            broadcastToRoomId(
                this._roomId, 
                'roundOver', 
                winResults
            );
            resolve(winResults);
        })     
        //need story + scores 
    }
    
    this.pauseTurns = function() {
        this._timerBroadcaster.stopTimerWithoutResolving();
        broadcastToRoomId(
            this._roomId, 
            'waiting', 
            'Not enough players to continue, waiting for another...'
        );
        this.isPaused = true;
    }

    //when restarting after a player leaves and another joins 
    this.resumeTurns = function() {
        this._timerBroadcaster.stopTimerWithoutResolving();
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
        this._timerBroadcaster.stopTimerWithResolve();
    }

    this.onVoteReceived = function(user, vote, clientCount) {
        if (this._turnStatus != TurnStatus.VOTING) {
            return;
        }
        this.currentRound.addVote(user, vote);  
        if (!this._haveAllUsersFinishedVoting(clientCount)) {
            return;
        }    
        this._timerBroadcaster.stopTimerWithResolve();
    }

    this._haveAllUsersFinishedVoting = function(clientsInRoom) {
        return clientsInRoom == this.currentRound.votes.length;
    }

    this._haveAllUsersFinishedWriting = function(clientsInRoom) {
        return clientsInRoom == this.currentRound.writings.length;
    }



    //can't broadcast a writing to the same user that wrote it 
    //TODO: refactor, there's 3 loops in this function :(
    this._broadcastVoteStart = () => {
        const broadcasts = [];
        this.currentRound.writings.forEach(aWriting1 => {
            const aBroadcast = {socketId: aWriting1.user.socketId, writings: []};
            this.currentRound.writings.forEach(aWriting2 => {
                if (aWriting1.user.socketId != aWriting2.user.socketId ) {
                    aBroadcast.writings.push({
                        user : aWriting2.user.socketId,
                        message : aWriting2.message
                    })
                }
            });     
            broadcasts.push(aBroadcast)
        });
        //(broadcasts);
        broadcasts.forEach((aBroadcast) => {
            broadcastToRoomId(aBroadcast.socketId, 'vote', aBroadcast.writings);
        });
    }

}