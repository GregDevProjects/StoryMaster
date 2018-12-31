//https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34
import openSocket from 'socket.io-client';
let socket = '';
const host = 'http://localhost:4000';

const GAME_START_MESSAGE = "GS";
const GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE = 'WTS';
const GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE = 'WTC';
const WRITING_TIMER_STATUS = 1;
const VOTING_TIMER_STATUS = 2;

export function unsubscribeListener(eventName) {
    socket.off(eventName);
}

export function onRoundResults(callBack) {
    socket.on('results', function(roundResults){
        callBack(roundResults);
    })
}

export function onVotingTimerTick(callBack) {
    socket.on('turnTimer', function(msg){
        if(msg.type === VOTING_TIMER_STATUS) {
            callBack(msg.seconds);
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
            callBack(msg.seconds);
        }
    });
}

export function onWritingStart(callBack) {
    socket.on('writing', function() {
        callBack();
    });
}

//for debugging only
export function waiting() {
    socket.on('waiting', function(msg) {
        console.log(msg);
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
    socket.on('waiting', function(msg) {
        if (msg === GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE) {
            callBack();
        }
    });    
}

//export { waiting, connect, onConnection, submitName, onWaitingForPlayersToBeginGame };