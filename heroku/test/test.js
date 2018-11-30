var assert = require('assert');
var client = require('socket.io-client');
var game = require('../game/index');
var room = require('../room/Room');


function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function kickAllClients(amount) {

    Object.values(testGame.lobby._io.of("/").connected).forEach(function(s) {
        s.disconnect();
        if (amount) {
            console.log(amount)
            amount--;
        }
        if (amount <= 0) {
            return;
        }
    });
}

before(function() {
    testGame = game.startIoAndLobby();
});

after(function() {
    testGame.http.forceShutdown(function() {
        console.log('Everything is cleanly shutdown.');
        http.close();
      });
});

afterEach(function(done){
    kickAllClients();
    // testGame.http.shutdown(function() {
    //     console.log('Everything is cleanly shutdown.');
    //     done();
    // });
    setTimeout(function() {
        
        done();
    }, 200);    
});

beforeEach(function(done){
     kickAllClients();
    // testGame = game.startIoAndLobby();
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
        const MAX_USERS_IN_ROOM =  room.MAX_USERS_IN_ROOM;
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

    it('broadcasts a start game message when the minimum amount of players join', function(done) {
        let broadcastedClients = 0;
        const requiredUsersToStart = room.MIN_USERS_IN_ROOM;
        for (let i = 0; i < requiredUsersToStart; i++) {
            client('http://localhost:3000/').on('waiting', (msg) => {
                if (msg === room.GAME_START_MESSAGE) {
                    broadcastedClients++;
                }
            });
        }
        setTimeout(() => {
            assert.equal(broadcastedClients, requiredUsersToStart);
            done();
        }, 100)
    });

    it('broadcasts a waiting message if not enough players have joined', function(done) {
        let broadcastedClients = 0;
        const oneLessThanRequiredUsersToStart = room.MIN_USERS_IN_ROOM - 1; 
        for (let i = 0; i < oneLessThanRequiredUsersToStart; i++) {
            client('http://localhost:3000/').on('waiting', (msg) => {
                if (msg === room.GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE) {
                    broadcastedClients++;
                }
            });
        }
        setTimeout(() => {
            assert.equal(broadcastedClients, oneLessThanRequiredUsersToStart);
            done();
        }, 100)
    });

    it('broadcasts a waiting message if enough players leave a game that started', function(done) {
        let broadcastedClients = 0;
        const clientThatLeaves = client('http://localhost:3000/');

        for (let i = 0; i < room.MIN_USERS_IN_ROOM - 1; i++) {
            client('http://localhost:3000/').on('waiting', (msg) => {
                if (msg === room.GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE) { 
                    broadcastedClients++;
                }
            });
        }
        setTimeout(() => {
            clientThatLeaves.disconnect();
        }, 100)
        setTimeout(() => {
            assert.equal(broadcastedClients, room.MIN_USERS_IN_ROOM -1);
            done();
        }, 200)
    });
});