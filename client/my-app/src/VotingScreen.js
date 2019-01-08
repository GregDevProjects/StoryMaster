import React from "react";
import FabIconButton from './FabIconButton'
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//https://material.io/design/components/progress-indicators.html#linear-progress-indicators
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { submitVote, onVotingTimerTick, onRoundResults, unsubscribeListener } from './socketApi'
import StoryDrawer from './StoryDrawer'
import ScoreDrawer from './ScoreDrawer'

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
                    <Grid
                        container
                        justify="center"
                        alignItems="center"
                    >
                        <Typography
                            style={{
                                display: "inline-block",
                                marginLeft: "10px",
                                position: "relative",
                                fontSize: "20px",
                                bottom: "3px",
                                textAlign: "center"
                            }}
                        >
                            { isVoteSubmitted
                              ? "waiting for other players"
                              : votingTimeLeft ? votingTimeLeft + " left to vote" : "voting"
                            }
                        </Typography>
                    </Grid>
                    <LinearProgress 
                        variant={ isVoteSubmitted
                                  ? "indeterminate"
                                  : "determinate"
                                }
                        color={ isVoteSubmitted
                                ? "primary"
                                : "secondary"
                              }
                        value={ isVoteSubmitted
                                ? null
                                : (votingTimeLeft/totalVotingTime) * 100
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
