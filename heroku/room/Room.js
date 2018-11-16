var uniqid = require('uniqid');

//TODO: use a decorator pateren for all these promoses that will be needed
//https://innolitics.com/articles/javascript-decorators-for-promise-returning-functions/
function Room(io) {
    //TODO: find best practice for class level variables like this
    this._MAX_USERS_IN_ROOM = 3;
    this.id = uniqid();
    this._io = io;
    this._getClientCount = function () {
       return new Promise((resolve, reject) => {
            this._io.in(this.id).clients((err, clients) => {
                if (err) {
                    reject(err);
                }
                resolve(clients.length);
            });       
        }) 
    }
    this.join = function (socket) {
        socket.join(this.id);
    }
    this.isAnotherPlayerNeeded = async function () {
        return await this._getClientCount() < this._MAX_USERS_IN_ROOM;
    }
}

module.exports = {
    Room: Room
}
