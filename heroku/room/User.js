module.exports = {
    User : User
}

function User(socketId, name) {
    this.socketId = socketId;
    this.name = name;
}