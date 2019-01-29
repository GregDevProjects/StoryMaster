import React from "react";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import { onResultsTimerTick, unsubscribeListener, roundStart } from '../socketApi'
import StatusLoader from '../components/StatusLoader'

export default class RoundResults extends React.Component {

    constructor(props) {
        super(props);
        this.results = props.props.results;
        this.state = {showStory: false};
        this.story = this.props.story;
        this.scores = props.scores;
    }

    componentDidMount() {
        onResultsTimerTick((countDownValue, totalSeconds) => {
            this.setState({
                displayingInfoTimeLeft: countDownValue,
                totalDisplayInfoTime: totalSeconds,
            })
        })
        roundStart((roundsLeft, isFirstRound)=>{
            this.props.changeScreen('WritingScreen', {roundsLeft: roundsLeft, isFirstRound: isFirstRound});
        })
    }

    componentWillUnmount() {
        unsubscribeListener('turnTimer');
        unsubscribeListener('roundStart');
    }

    render() {
        const results = this.results;
        const winner = this.results.winner;
        const displayingInfoTimeLeft = this.state.displayingInfoTimeLeft;
        const totalDisplayInfoTime = this.state.totalDisplayInfoTime;

        return (
            <React.Fragment>
                <StatusLoader
                    variant="determinate"
                    color="secondary"
                    percentComplete={displayingInfoTimeLeft/totalDisplayInfoTime}
                    text={winner.user.name + " won the round"}                        
                />
                <WritingResults
                    results={results}
                >
                </WritingResults>
            </React.Fragment>
        );
    }
}



class WritingResults extends React.Component {
    constructor(props) {
        super(props);
        this.results = props.results.results;
    }

    render(){
        const StyledBadge = withStyles({
            root: {
                width: '100%',
            },
            badge: {
                position: "absolute",
                right: "0"
            },
        
            })(Badge);

        const resultCards = this.results.map((result) =>
        <Card
            key={result.userId}
            style={{width: "calc(100% - 20px)", marginLeft: "10px", marginRight: "10px", marginTop:"20px"}}
        >

            <CardHeader
            style={{width:"100%"}}
            title={
                <StyledBadge 
                    badgeContent={ result.votes 
                        ? result.votes 
                        : 0
                    } 
                    color="primary"
                >
                {result.user.name}
                </StyledBadge>
            }
            subheader={result.message}
            />
        </Card>
        
    );
    return <React.Fragment>
        {resultCards}
    </React.Fragment>
    }

}