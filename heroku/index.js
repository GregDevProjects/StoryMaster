const game = require('./game/index');
const gameHandler = game.startIoAndLobby();


game.startIntervalDebugging(gameHandler.lobby);