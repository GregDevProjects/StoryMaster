import React from "react";
import FabIconButton from '../components/FabIconButton'
import Fade from '@material-ui/core/Fade';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { submitVote, onVotingTimerTick, onRoundResults, unsubscribeListener } from '../socketApi'
import StoryDrawer from '../components/StoryDrawer'
import ScoreDrawer from '../components/ScoreDrawer'

import StatusLoader from '../components/StatusLoader'

export default class VotingScreen extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isVoteSubmitted: false,
            showStory: false
        };
        this.story = props.story;
        this.votes = props.props.votes;
        this.scores = props.scores;
    }

    componentDidMount() {
        onVotingTimerTick((countDownValue, totalSeconds) => { 
            this.setState({
                votingTimeLeft: countDownValue,
                totalVotingTime: totalSeconds
            })
        });

        onRoundResults((results) => {
            this.props.changeScreen('RoundResultsScreen', {results: results});
        })
    }

    componentWillUnmount() {
        unsubscribeListener('turnTimer');
        unsubscribeListener('roundOver');
    }

    sendVote(user) {
        this.setState({
            isVoteSubmitted: true
        })
        submitVote(user);
    }

    render() {
        const isVoteSubmitted = this.state.isVoteSubmitted;
        const votingTimeLeft = this.state.votingTimeLeft;
        const votes = this.votes;
        const totalVotingTime = this.state.totalVotingTime;

        return (
            <React.Fragment>
                    <StatusLoader
                        variant={ isVoteSubmitted
                            ? "indeterminate"
                            : "determinate"
                          }
                        color={ isVoteSubmitted
                                ? "primary"
                                : "secondary"
                                }
                        percentComplete={ isVoteSubmitted
                                ? null
                                : (votingTimeLeft/totalVotingTime)
                                }
                        text={ isVoteSubmitted
                            ? "waiting for other players"
                            : votingTimeLeft ? votingTimeLeft + " left to vote" : "voting"
                          }
                    />
                    <Fade 
                        in={!isVoteSubmitted}
                    >
                        <div>
                            <Votes
                                votes={votes}
                                sendVote={this.sendVote.bind(this)}
                            />
                        </div>
                    </Fade>
                <FabIconButton
                    position="right"
                    fontAwesomeIcon="fas fa-list-ol"
                    onClick={ ()=>{ this.setState({showScore: true})}}
                />
                <FabIconButton
                    position="left"
                    fontAwesomeIcon="fas fa-book"
                    onClick={ ()=>{ this.setState({showStory: true}) } }
                />
                <StoryDrawer
                    open={this.state.showStory}
                    close={() => { this.setState({showStory: false})}}
                    story={this.story}
                >
                </StoryDrawer>
                <ScoreDrawer
                    open={this.state.showScore}
                    close={() => { this.setState({showScore: false})}}
                    scores={this.scores}
                />
            </React.Fragment>
        );
    }
}

class Votes extends React.Component {
    constructor(props) {
        super(props);
        this.votes = props.votes;
    }

    render(){
        const voteCards = this.votes.map((vote) =>
        <Card
            key={vote.user}
            style={{width: "calc(100% - 20px)", marginLeft: "10px", marginRight: "10px", marginTop:"20px"}}
            onClick={() =>this.props.sendVote(vote.user)}
        >
            <CardActionArea>
                <div
                    style={{padding:"10px"}}
                >
                    {vote.message}
                </div>
            </CardActionArea>
        </Card>
    );
    return <React.Fragment>
        {voteCards}
    </React.Fragment>
    }

}
