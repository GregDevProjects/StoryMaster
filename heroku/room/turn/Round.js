var _ = require('lodash');

module.exports = {
    Round : Round
}

function Round(number) {
    this.number = number;
    this.writings = [];
    this.votes = [];
    this.addWriting = (user, message) => {
        if (this._hasUserAlreadyWritten(user)) {
            return;
        }
        
        this.writings.push({message: message, user: user, userId : user.socketId});
    }

    this.addVote = (user, vote) => {
        if (this._hasUserAlreadyVoted(user)) {
            return;
        }
        this.votes.push({user : user, vote : vote, userId : user.socketId})
    }

    //RETURNS:
    // [ { message:
    //     'a was too slow to submit a writing in time, so this is their entry :(',
    //    user:
    //     User {
    //       socketId: '9A0HIYXWXcE9ou5HAAAD',
    //       name: 'a',
    //       isApprovedToPlayInTurns: true },
    //    userId: '9A0HIYXWXcE9ou5HAAAD',
    //    votes: 2 },
    //  { message:
    //     'b was too slow to submit a writing in time, so this is their entry :(',
    //    user:
    //     User {
    //       socketId: 'mNDA0BJOvVqWXUfBAAAE',
    //       name: 'b',
    //       isApprovedToPlayInTurns: true },
    //    userId: 'mNDA0BJOvVqWXUfBAAAE' },
    //  { message:
    //     'c was too slow to submit a writing in time, so this is their entry :(',
    //    user:
    //     User {
    //       socketId: 'ybxzl8X-FnqNx8wrAAAF',
    //       name: 'c',
    //       isApprovedToPlayInTurns: true },
    //    userId: 'ybxzl8X-FnqNx8wrAAAF',
    //    votes: 1 } ]
    this.getRoundResultsWithWinner = () => {
        const results = this.getRoundResults();
        return { 
                    winner:  _.maxBy(results, 'votes'),
                    results: _.orderBy(results, 'votes', 'desc')
                };
    }
    //TODO: refactor
    this.getRoundResults = () => {
       
        const score = this._getVoteResults();
   
        let merged = this._getWritingsMergedWithVotes();
       
        for (var prop in score) {
            merged.forEach(function(aMerge, index){
                delete merged[index]["vote"];
                if (aMerge['userId'] != prop ) {
                    return;
                }
                merged[index]['votes'] = score[prop];
            }) 
        }
        merged.forEach((element, index) => {
            if (element.votes == undefined) {
                merged[index].votes = 0;
            }
        })
        return merged;
    }

    this._getWritingsMergedWithVotes = () => {
        return _(this.writings)
            .concat(this.votes)
            .groupBy("userId")
            .map(_.spread(_.merge))
            .value();
    }

    this._getVoteResults = () => {
        return _.countBy(_.mapValues(this.votes, function(o) { return o.vote; }));
    }

    this._hasUserAlreadyVoted = (user) => {
        return this.votes.find(function(aVote){
            return aVote.user.socketId == user.socketId;
        });
    }
    this._hasUserAlreadyWritten = (user) => {
        return this.writings.find(function(aWriting){
            return aWriting.user.socketId == user.socketId;
        });
    }
}