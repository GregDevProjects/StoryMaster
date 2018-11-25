exports.Round = function(number) {
    this.number = number;
    this.writings = [];
    this.addWriting = function(user, message) {    
        if(this.hasUserAlreadySubmitted(user)) {
            return;
        }
        console.log(
            'added writing'
        )
        this.writings.push({message: message, user: user})
    }

    this.hasUserAlreadySubmitted = function(user) {
        return this.writings.find(function(aWriting){
            return aWriting.user == user;
        });
    }
}