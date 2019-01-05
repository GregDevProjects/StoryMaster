import React from "react";
import HelpButton from './HelpButton'
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//https://material.io/design/components/progress-indicators.html#linear-progress-indicators
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import { onResultsTimerTick, unsubscribeListener, roundStart } from './socketApi'


export default class RoundResults extends React.Component {

    constructor(props) {
        super(props);
        this.results = props.props.results;
        this.state = {};
    }

    componentDidMount() {
        onResultsTimerTick((countDownValue, totalSeconds) => {
            this.setState({
                displayingInfoTimeLeft: countDownValue,
                totalDisplayInfoTime: totalSeconds
            })
        })
        roundStart(()=>{
            this.props.changeScreen('WritingScreen', {});
        })
    }

    componentWillUnmount() {
        unsubscribeListener('turnTimer');
    }

    render() {
        const results = this.results;
        const winner = this.results.winner;
        const displayingInfoTimeLeft = this.state.displayingInfoTimeLeft;
        const totalDisplayInfoTime = this.state.totalDisplayInfoTime;

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
                        {winner.user.name} won the round!
                    </Typography>
                </Grid>
                <LinearProgress 
                    variant="determinate"
                    color="secondary"
                    value={(displayingInfoTimeLeft/totalDisplayInfoTime) * 100}
                />
                <WritingResults
                    results={results}
                >
                </WritingResults>
                <HelpButton/>
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