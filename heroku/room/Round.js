var _ = require('lodash');

exports.Round = function(number) {
    this.number = number;
    this.writings = [];
    this.votes = [];
    this.addWriting = (user, message) => {    
        if (this._hasUserAlreadyWritten(user)) {
            return;
        }
        this.writings.push({message: message, user: user})
    }

    this.addVote = (user, vote) => {
        if (this._hasUserAlreadyVoted(user)) {
            return;
        }
        this.votes.push({user, vote})
    }

    this.getRoundResultsWithWinner = () => {
        const results = this.getRoundResults();
        return { 
                    winner:  _.maxBy(results, 'votes'),
                    results: results  
                };
    }
    //TODO: refactor
    this.getRoundResults = () => {
        const score = this._getVoteResults();
        let merged = this._getWritingsMergedWithVotes();
        for (var prop in score) {
            merged.forEach(function(aMerge, index){
                delete merged[index]["vote"];
                if (aMerge['user'] != prop ) {
                    return;
                }
                merged[index]['votes'] = score[prop]
            }) 
        }
        return merged;
    }

    this._getWritingsMergedWithVotes = () => {
        return _(this.writings)
            .concat(this.votes)
            .groupBy("user")
            .map(_.spread(_.merge))
            .value();
    }

    this._getVoteResults = () => {
        return _.countBy(_.mapValues(this.votes, function(o) { return o.vote; }));
    }

    this._hasUserAlreadyVoted = (user) => {
        return this.votes.find(function(aVote){
            return aVote.user == user
        });
    }
    this._hasUserAlreadyWritten = (user) => {
        return this.writings.find(function(aWriting){
            return aWriting.user == user;
        });
    }
}