var assert = require('assert');
var client = require('socket.io-client');
var game = require('../game/index');
var room = require('../room/Room');
var turn = require('../room/turn/Turn');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function kickAllClients(amount) {

    Object.values(testGame.lobby._io.of("/").connected).forEach(function(s) {
        s.disconnect();
        if (amount) {
            //console.log(amount)
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
    setTimeout(function() {
        done();
    }, 200);    
});

beforeEach(function(done){
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
        const MAX_USERS_IN_ROOM =  room.MAX_USERS_IN_ROOM;
        for (let i = 0; i < clients; i++) {
            let c = client('http://localhost:4000/').on('waiting', (msg) => {
                if(msg == 'connected') {
                    c.emit(  
                        'name',
                        i   
                    );
                }

            });
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
            client('http://localhost:4000/');
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
            const c = client('http://localhost:4000/');
            c.on('waiting', (msg) => {
                if(msg == 'connected') {
                    c.emit(  
                        'name',
                        i   
                    );
                }
        
            });
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
            const c = client('http://localhost:4000/').on('waiting', (msg) => {
                if (msg === room.GAME_START_MESSAGE) {
                    broadcastedClients++;
                }
            });

            c.on('waiting', (msg) => {
                if(msg == 'connected') {
                    c.emit(  
                        'name',
                        i   
                    );
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
            const c = client('http://localhost:4000/').on('waiting', (msg) => {
                if (msg === room.GAME_NEEDS_MORE_PLAYERS_TO_START_MESSAGE) {
                    broadcastedClients++;
                }
            });

            c.on('waiting', (msg) => {
                if(msg == 'connected') {
                    c.emit(  
                        'name',
                        i   
                    );
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
        const clientThatLeaves = client('http://localhost:4000/');

        clientThatLeaves.on('waiting', (msg) => {
            if(msg == 'connected') {
                clientThatLeaves.emit( 
                    'name',
                    'i'   
                );
            }
    
        });

        for (let i = 0; i < room.MIN_USERS_IN_ROOM - 1; i++) {
            const c = client('http://localhost:4000/').on('waiting', (msg) => {
                if(msg == 'connected') {
                    c.emit(  
                        'name',
                        i   
                    );
                }
            });

            c.on('error', (msg) => {
                if (msg === room.GAME_NEEDS_MORE_PLAYERS_TO_RESUME_MESSAGE) { 
                    broadcastedClients++;
                }
            });
        }
        setTimeout(() => {
            clientThatLeaves.disconnect();
        }, 200)
        setTimeout(() => {
            assert.equal(broadcastedClients, room.MIN_USERS_IN_ROOM -1);
            done();
        }, 300)
    });
});

function startGame(numberOfUsers) {
    const clients = [];
    for (let i = 0; i < numberOfUsers; i++) {
        let c = client('http://localhost:4000/')    
        c.on('waiting', (msg) => {
            if(msg == 'connected') {
                c.emit(  
                    'name',
                    i   
                );
            }
    
        });

        clients.push(c);
    }
    return clients;
}

function submitWritingForAllClients(clients) {
    clients.forEach((c) => {
        c.on('waiting', (msg) => {
            if (msg === room.GAME_START_MESSAGE) {
                c.emit(  
                    'msg',
                    'this is a writing'
                )
            }
        }); 

    })
    return clients;
}

describe('Turn broadcasting to clients', function() {
    //user can only write during writing period
    //returns the correct round results 
    //returns the correct score 
    //placeholder writing when time runs out 
    //placeholder votes when time runs out
    //joining a game in progress should broadcast the story so far and tell them to wait
    //joining a game waiting for players should restart the round
    //test the timer??
    //restarts after a game

    it('stops a user from submitting two writings in a round', function(done) {
        const clients = startGame(room.MIN_USERS_IN_ROOM);
        //this will need to change if the min users > 3
        const votesAllowed = 6;
        let writeCount = 0;
        let gotFirstWriting = true;

        clients.forEach((c) => {
            c.on('waiting', (msg) => {
                if (msg === room.GAME_START_MESSAGE) {
                    c.emit(  
                        'msg',
                        '1'
                    )
                    c.emit(  
                        'msg',
                        '2'
                    )
                }
            }); 
    
        })

        clients.forEach((c) => {
            c.on('vote', function(voteChoices){
                //console.log(voteChoices)
                voteChoices.forEach((choice) => {
                    writeCount++;
                    gotFirstWriting = choice.message == '1'; 
                })  
            });
        })

        setTimeout(() => {
            assert.equal(
                (writeCount == votesAllowed) && gotFirstWriting, 
                true
            );
            done();
        }, 100)
    });  

    it('stops a user from changing thier writing in the voting phase', function(done) {
        const clients = startGame(room.MIN_USERS_IN_ROOM);
        //this will need to change if the min users > 3
        const votesAllowed = 6;
        let writeCount = 0;
        let allWritingsCorrect = true;

        submitWritingForAllClients(clients);

        clients.forEach((c) => {
            c.on('vote', function(voteChoices){
                //try to submit another writing at the voting phase
                c.emit(  
                    'msg',
                    '1'
                )
                c.emit(
                    'vote',
                    voteChoices[0].user
                )
            });
            c.on('roundOver', function(roundResults){
                roundResults.results.forEach(function(result){
                    if (result.message != 'this is a writing') {
                        allWritingsCorrect = false;
                    }
                })
            })
        })
        setTimeout(() => {
            assert.equal(
                allWritingsCorrect, 
                true
            );
            done();
        }, 100)
    });

    it('stops a user from voting twice in a round', function(done) {
        const clients = startGame(room.MIN_USERS_IN_ROOM);
        let voteCount = 0;
        
        submitWritingForAllClients(clients);

        clients.forEach((c) => {
            c.on('vote', function(voteChoices){           
                for(let i =0; i<3; i++){
                    c.emit(
                        'vote',
                        voteChoices[0].user
                    )
                }
            });
        })

        clients[0].on('roundOver', function(roundResults){
            roundResults.results.forEach((res) => {
                voteCount+=res.votes;
            }) 
        })

        setTimeout(() => {
            assert.equal(
                voteCount, 
                room.MIN_USERS_IN_ROOM
            );
            done();
        }, 100)
    });

    it('broadcasts vote status after receiving all writings', function(done) {
        let broadcastedClients = 0;
        for (let i = 0; i < room.MIN_USERS_IN_ROOM; i++) {
            let c = client('http://localhost:4000/').on('waiting', (msg) => {
                if (msg === room.GAME_START_MESSAGE) {
                    c.emit(  
                        'msg',
                        'this is a writing'
                    )
                }
            });
            c.on('vote', function(votes){
                broadcastedClients++;
            });
            c.on('waiting', (msg) => {
                if(msg == 'connected') {
                    c.emit(  
                        'name',
                        i   
                    );
                }
        
            });
        }
        setTimeout(() => {
            assert.equal(
                broadcastedClients, 
                room.MIN_USERS_IN_ROOM
            );
            done();
        }, 100)
    });

    it('broadcasts round over status after receiving all votes', function(done) {
        let broadcastedClients = 0;

        for (let i = 0; i < room.MIN_USERS_IN_ROOM; i++) {
            let c = client('http://localhost:4000/').on('waiting', (msg) => {
                if(msg == 'connected') {
                    c.emit(  
                        'name',
                        i   
                    );
                }
                if (msg === room.GAME_START_MESSAGE) {
                    c.emit(  
                        'msg',
                        'this is a writing'
                    )
                }
            });
            c.on('vote', function(votes){
                c.emit(
                    'vote',
                    votes[getRandomInt(0,room.MIN_USERS_IN_ROOM - 1)].user
                )
            });
            c.on('roundOver', function(stats){
                broadcastedClients++;
            });
        }
        setTimeout(() => {
            assert.equal(
                broadcastedClients, 
                room.MIN_USERS_IN_ROOM
            );
            done();
        }, 100)
    });

    it('displays the voting options as writings that were not written by the same user', function(done) {
        let clientsThatSeeTheirOwnWriting = 0;

        for (let i = 0; i < room.MIN_USERS_IN_ROOM; i++) {
            let c = client('http://localhost:4000/').on('waiting', (msg) => {
                if (msg === room.GAME_START_MESSAGE) {
                    c.emit(  
                        'msg',
                        i
                    )
                }
            });
            c.on('vote', function(votes){
                votes.forEach(function(aVote){
                    if(aVote.message == i) {
                        clientsThatSeeTheirOwnWriting++
                    }
                })
            });

        }
        setTimeout(() => {
            assert.equal(
                clientsThatSeeTheirOwnWriting, 
                0
            );
            done();
        }, 100)
    });
  
    it('broadcasts the story of the round winner', function(done) {
        let roundResults = "";
        for (let i = 0; i < room.MIN_USERS_IN_ROOM; i++) {
            let c = client('http://localhost:4000/').on('waiting', (msg) => {
                if(msg == 'connected') {
                    c.emit(  
                        'name',
                        i   
                    );
                }
                if (msg === room.GAME_START_MESSAGE) {
                    c.emit(  
                        'msg',
                        i
                    )
                }
            });
            c.on('vote', function(votes){
                //console.log(votes);
                let votedFor0 = false;
                
                votes.forEach(function(aVote){
                    if (aVote.message == 0) {
                        votedFor0 = true;
                        c.emit(
                            'vote',
                            aVote.user
                        )
                    }
                })

                if (!votedFor0) {
                    c.emit(
                        'vote',
                        votes[0].user
                    )                
                }
            });

            c.on('results', function(results){
                //console.log(results)
                roundResults = results;

            });

        }
        setTimeout(() => {
            assert.equal(
                roundResults.story, 
                0
            );
            done();
        }, 200)
    });

});

