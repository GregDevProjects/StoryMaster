var assert = require('assert');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var client = require('socket.io-client');
var lobbyHandler = require('../lobby/index');


function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function kickAllClients() {
    Object.values(lobby._io.of("/").connected).forEach(function(s) {
        s.disconnect();
    });
}

before(function() {
    
    //TODO: put all this server setup code in method
    http.listen(3000);
    lobby = lobbyHandler.createLobby(io);
    lobby.initLobby();
    lobby.assignClientsOnConnectAndDisconnect();
});

after(function() {
    http.close();
});

afterEach(function(done){
    //disconnect sockets after each test 
    kickAllClients();

    setTimeout(function() {
        done();
    }, 500);    
});

describe('Lobby managing rooms', function() {
    it('creates an empty room on initialization', async function() {
        const count  = await lobby._rooms[0]._getClientCount();
        assert.equal(count, 0);
    });

    it('creates new rooms when the max users is reached', function(done) {
        const clients = getRandomInt(5,15);
        const MAX_USERS_IN_ROOM = lobby._rooms[0]._MAX_USERS_IN_ROOM;

        for (let i = 0; i < clients; i++) {
            client('http://localhost:3000/');
        }

        setTimeout( async function() {
            const count  = await lobby._rooms[ Math.ceil(clients/MAX_USERS_IN_ROOM) - 1]._getClientCount();
            assert.equal(
                count, 
                clients % MAX_USERS_IN_ROOM == 0 ? 3 : clients % MAX_USERS_IN_ROOM 
            );
            done();
        }, 500);     
    });

    it('deletes all rooms except one when all users disconnect', function(done) {
        const clients = 15;
        for (let i = 0; i < clients; i++) {
            client('http://localhost:3000/');
        }
        setTimeout(function() {
            kickAllClients();
        }, 200);  

        setTimeout(function() {
            assert.equal(lobby._rooms.length, 1);
            done();
        }, 300)
    });

});