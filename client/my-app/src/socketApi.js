//https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34
import openSocket from 'socket.io-client';
let socket = '';
const host = 'https://glacial-escarpment-78035.herokuapp.com/';

const GAME_START_MESSAGE = "GS";
const GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE = 'WTS';
const GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE = 'WTC';
const WRITING_TIMER_STATUS = 1;
const VOTING_TIMER_STATUS = 2;
const DISPLAYING_INFO_TIMER_STATUS = 3;
const NEXT_GAME_TIMER_STATUS = 4;

//TODO: implement waitingRoundFinish

export function onNextGameStartTick(callBack) {
    socket.on('turnTimer', function(msg){
        if(msg.type === NEXT_GAME_TIMER_STATUS) {
            callBack(msg.seconds, msg.totalSeconds);
        }
    });
}

export function onGameOver(callBack) {
    socket.on('gameOver', function(msg) {
        callBack(msg.winner, msg.story);
    });
}

export function roundStart(callBack) {
    socket.on('roundStart', function(msg) {
        callBack(msg.roundsLeft);
    });
}

//gives the story so far and number of rounds won by each player
export function onStoryResultUpdate(callBack) {
    socket.on('results', function(msg) {
        callBack(msg.story, msg.score);
    });
}

export function onResultsTimerTick(callBack) {
    socket.on('turnTimer', function(msg){
        if(msg.type === DISPLAYING_INFO_TIMER_STATUS) {
            callBack(msg.seconds, msg.totalSeconds);
        }
    });   
}

export function unsubscribeListener(eventName) {
    socket.off(eventName);
}

//gives the number of votes for each writing, and the winning writing
export function onRoundResults(callBack) {
    socket.on('roundOver', function(roundResults){
        callBack(roundResults);
    })
}

export function onVotingTimerTick(callBack) {
    socket.on('turnTimer', function(msg){
        if(msg.type === VOTING_TIMER_STATUS) {
            callBack(msg.seconds, msg.totalSeconds);
        }
    });
}

export function submitVote(userId) {
    socket.emit(
        'vote',
        userId
    )
}

export function onVotingStart(callback) {
    socket.on('vote', function(voteChoices) {
        callback(voteChoices);
    });
}

export function submitWriting(writing) {
    socket.emit(
        'msg',
        writing
    );
}

export function onWritingTimerTick(callBack) {
    socket.on('turnTimer', function(msg){
        if(msg.type === WRITING_TIMER_STATUS) {
            callBack(msg.seconds, msg.totalSeconds);
        }
    });
}

export function onWritingStart(callBack) {
    socket.on('writing', function() {
        callBack();
    });
}

//for debugging only
export function waiting(callBack) {
    socket.on('waiting', function(msg) {
        console.log(msg);
        callBack(msg);
    });
}

export function onWaitingForPlayersToBeginGame(callBack) {
    socket.on('waiting', function(msg) {
        if (msg === GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE) {
            callBack();
        }
    }); 
}

export function onGameStart(callBack) {
    socket.on('waiting', function(msg) {
        if (msg === GAME_START_MESSAGE) {
            callBack();
        }
    }); 
}

export function onConnection(callBack) {
    socket.on('waiting', function(msg) {
        if (msg === "connected") {
            callBack();
        }
    });
}
//this must be called before anything else
export function connect() {
    socket = openSocket(host);
}

export function submitName(name) {
    socket.emit(  
        'name',
        name  
    );
}

export function onWaitingForPlayersToContinueGame(callBack) {
    socket.on('error', function(msg) {
        if (msg === GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE) {
            callBack();
        }
    });
}
