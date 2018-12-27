//sets and broadcasts the state of the game, gets user input and records it in a round
//handles:
//1. users finishing turns 
//2. users leaving/joining 
var round = require('./Round');
var broadcastToRoomId = require('../../io/index').broadcastToRoomId;
var timerBroadcaster = require('./CountdownTimer').TimerBroadcaster;
var _ = require('lodash');

const TurnStatus = {
    WRITING: 1,
    VOTING: 2,
    DISPLAYING_INFO: 3,
    GAME_OVER: 4
}

const SECONDS_TO_WRITE = 3;
const SECONDS_TO_VOTE = 3;
const SECONDS_TO_SHOW_ROUND_RESULTS = 2;
const SECONDS_TO_SHOW_GAME_OVER = 5;
const ROUNDS_PER_GAME = 3

module.exports = {
    TurnStatus : TurnStatus,
    Turn : Turn
}

function Turn(roomId, usersInRoom) {
    this._turnStatus;
    this.turnsHaveStarted = false;
    this.isPaused = false;
    this._story = '';
    this._roundWinners = []; 
    this._timerBroadcaster = new timerBroadcaster(roomId);

    //for when all users leave a room 
    //this will only be called by the only room left, otherwise the room will be destroyed when all users leave
    this.reset = function() {
        this.isPaused = false;
        this._timerBroadcaster.stopTimerWithoutResolving();
        this.clearGame();
        //TODO: add logic to clear rounds here
    }

    this.getRoundWinners = function() {
        //TODO: this is messy because _.countBy returns an object, need to find a better way to do this
        const a = _.countBy(this._roundWinners, function(o){
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
        return winArray;
    }

    this.startTurns = async function() {
        this.turnsHaveStarted = true;
        for(let i = 0; i < ROUNDS_PER_GAME; i++) {
            usersInRoom.forEach(aUser => {aUser.isApprovedToPlayInTurns = true;});
            broadcastToRoomId(roomId, 'roundStart');
            this.currentRound = new round.Round(1);
            const roundResults = await this._doARound();
            this._story += (' ' + roundResults.winner.message);
            this._roundWinners.push(roundResults.winner.user);

            broadcastToRoomId(
                roomId, 
                'results', 
                {    
                    story:this._story, 
                    score: this.getRoundWinners()
                }
            );
            await this._timerBroadcaster.start(TurnStatus.DISPLAYING_INFO, SECONDS_TO_SHOW_ROUND_RESULTS);
        }

        broadcastToRoomId(
            roomId, 
            'gameOver',
            {
                winner : this.getRoundWinners(),
                story : this._story
            }
        );

        await this._timerBroadcaster.start(TurnStatus.GAME_OVER, SECONDS_TO_SHOW_GAME_OVER);
        this.clearGame();
        this.startTurns();
    }

    this.clearGame = () => {
        this._story = '';
        this._roundWinners = [];       
    }

    this.addWritingsForUsersThatDidNotWrite = (inputs) => {
        this.getUsersThatDidNotProvideInput(inputs).forEach((aUser) => {
            this.currentRound.addWriting(
                aUser,
                aUser.name + ' was too slow to submit a writing in time, so this is their entry :('
            )
        })

        
    }
    //{user : user, vote : vote, userId : user.socketId}
    this.addVotesForUsersThatDidNotVote = (inputs) => {
        this.getUsersThatDidNotProvideInput(inputs).forEach((aUser) => {
            const allUsersBesidesThisOne = _.filter(usersInRoom, (o) => {
                return o.socketId != aUser.socketId
            });

            const randomVote = this.getRandomInt(0,allUsersBesidesThisOne.length - 1);
            this.currentRound.addVote( 
                aUser,
                allUsersBesidesThisOne[randomVote].socketId 
            )
        })        
    }

    this.getUsersThatDidNotProvideInput = (inputs) => {
        const usersThatDidNotProvideInput = [];
        usersInRoom.forEach((aUserInRoom) => {
            if (!aUserInRoom.isApprovedToPlayInTurns) {
                return;
            }
            const matchingUser = inputs.find((aWriting) => {
                return aWriting.userId == aUserInRoom.socketId
            });
            if (!matchingUser) {
                usersThatDidNotProvideInput.push(aUserInRoom);
            }
        });
        return usersThatDidNotProvideInput;
    }


    this._doARound = () => {
        return new Promise(async (resolve, reject) => {
            this._turnStatus = TurnStatus.WRITING;
            await this._timerBroadcaster.start(TurnStatus.WRITING, SECONDS_TO_WRITE);
            this.addWritingsForUsersThatDidNotWrite(this.currentRound.writings);
            this._turnStatus = TurnStatus.VOTING;
            this._broadcastVoteStart();
            await this._timerBroadcaster.start(TurnStatus.VOTING, SECONDS_TO_VOTE);
            this.addVotesForUsersThatDidNotVote(this.currentRound.votes);

            this._turnStatus = TurnStatus.DISPLAYING_INFO;
            const winResults = this.currentRound.getRoundResultsWithWinner();
            broadcastToRoomId(
                roomId, 
                'roundOver', 
                winResults
            );
            resolve(winResults);
        })     
    }
    
    this.pauseTurns = function() {
        this._timerBroadcaster.stopTimerWithoutResolving();
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

    this.getRandomInt = (min, max) => {
        max++
        return Math.floor(Math.random() * max) + min;
    }

}