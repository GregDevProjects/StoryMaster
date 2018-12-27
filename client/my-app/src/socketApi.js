//https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34
import openSocket from 'socket.io-client';
let socket = '';
const host = 'http://localhost:4000';

const GAME_START_MESSAGE = "GS";
const GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE = 'WTS';
const GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE = 'WTC';
const WRITING_TIMER_STATUS = 1;
const WRITING_START_MESSAGE = 'writing';
const VOTING_START_MESSAGE = 'vote';

export function onWritingStart(callBack) {
    socket.on('writing', function() {
        console.log('called')
        callBack();
    });
}


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