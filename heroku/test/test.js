var assert = require('assert');
var client = require('socket.io-client');
var game = require('../game/index');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function kickAllClients() {
    Object.values(testGame.lobby._io.of("/").connected).forEach(function(s) {
        s.disconnect();
    });
}

before(function() {
    testGame = game.startIoAndLobby();
});

after(function() {
    testGame.http.close();
});

afterEach(function(done){
    kickAllClients();

    setTimeout(function() {
        done();
    }, 200);    
});

describe('Lobby managing rooms', function() {
    it('creates an empty room on initialization', async function() {
        const count  = await testGame.lobby._rooms[0]._getClientCount();
        assert.equal(count, 0);
    });

    it('creates new rooms when the max users is reached', function(done) {
        const clients = getRandomInt(5,15);
        const MAX_USERS_IN_ROOM = testGame.lobby._rooms[0]._MAX_USERS_IN_ROOM;

        for (let i = 0; i < clients; i++) {
            client('http://localhost:3000/');
        }

        setTimeout(function() {
            assert.equal(
                testGame.lobby._rooms.length,
                Math.ceil(clients/MAX_USERS_IN_ROOM)
            );
            done();
        }, 200);
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
            assert.equal(testGame.lobby._rooms.length, 1);
            done();
        }, 300)
    });

});

describe('Room managing clients', function() {
    it('counts the clients in the room', function(done) {
        const clients = getRandomInt(1,3);
        for (let i = 0; i < clients; i++) {
            client('http://localhost:3000/');
        }

        setTimeout(async () => {
            assert.equal(await testGame.lobby._rooms[0]._getClientCount(), clients);
            done();
        }, 200)
    });
});