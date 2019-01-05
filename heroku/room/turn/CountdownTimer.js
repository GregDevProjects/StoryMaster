var broadcastToRoomId = require('../../io/index').broadcastToRoomId;

module.exports = {
    TimerBroadcaster : TimerBroadcaster
}

function TimerBroadcaster(roomId) {
    this._roomId = roomId;

    this.start = (type, durationSeconds) => { 
        return  new Promise((resolve, reject) => {
            this._stopTimerEarly = resolve;
            this._countdown = durationSeconds;
            this._turnTimer = setInterval(() => { 
                if (this._countdown <= 0) {
                    clearInterval(this._turnTimer);
                    resolve();
                }
                console.log(durationSeconds)
                broadcastToRoomId(
                    this._roomId, 
                    'turnTimer', 
                    {
                        seconds: this._countdown,
                        type: type,
                        totalSeconds: durationSeconds
                    }
                );

                this._countdown--;
            }, 1000);
        })
    }

    this.stopTimerWithoutResolving = function() {
        clearInterval(this._turnTimer);
    }

    this.stopTimerWithResolve = function() {
        clearInterval(this._turnTimer);
        this._stopTimerEarly();
    }
}

