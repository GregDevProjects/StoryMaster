import React from "react";
import HelpButton from './HelpButton'
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//https://material.io/design/components/progress-indicators.html#linear-progress-indicators
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { submitVote, onVotingTimerTick, onRoundResults, unsubscribeListener } from './socketApi'


export default class VotingScreen extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isVoteSubmitted: false,
        };

        this.votes = props.props.votes;
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
                <HelpButton/>
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
