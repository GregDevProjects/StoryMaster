//https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34
import openSocket from 'socket.io-client';
let socket = '';
const host = 'http://localhost:4000';

function waiting() {
    socket.on('waiting', function(msg) {
        console.log(msg);
    });
}

function onConnection(callBack) {
    socket.on('waiting', function(msg) {
        if (msg === "connected") {
            callBack();
        }
    });
}

function connect() {
    socket = openSocket(host);
}

function submitName(name) {
    socket.emit(  
        'name',
        name  
    );
}



export { waiting, connect, onConnection };