import React from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import StatusLoader from '../components/StatusLoader'
import { onNextGameStartTick, unsubscribeListener } from '../socketApi'

export default class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
        this.winnerName = props.props.winner.name;
        this.story = props.props.story;
        this.votes = props.props.winner.score;
        this.state = {};
    }

    componentDidMount() { 
        onNextGameStartTick((countDownValue, totalSeconds) => {
            this.setState({
                displayingInfoTimeLeft: countDownValue,
                totalDisplayInfoTime: totalSeconds,
            })
        })
    }

    componentWillUnmount() {
        unsubscribeListener('turnTimer');
    }

    render() {
        const displayingInfoTimeLeft = this.state.displayingInfoTimeLeft;
        const totalDisplayInfoTime = this.state.totalDisplayInfoTime;

        return (
            <React.Fragment>
                <StatusLoader
                    text={(displayingInfoTimeLeft ? displayingInfoTimeLeft : "")  + " next story will start soon"}
                    variant="determinate"
                    percentComplete={displayingInfoTimeLeft/totalDisplayInfoTime}
                />
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                >
                    <Grid 
                        item 
                        style={{textAlign: 'center'}}
                        xs={12}
                    >
                        <Typography 
                            variant="h1"
                            style={{fontSize:"85px"}}
                        >
                            {this.winnerName} Wins
                        </Typography>
                        <Typography 
                            variant="h5"
                            
                            gutterBottom
                        >
                            {this.votes} votes
                        </Typography>
                        <Typography 
                            // variant="h5"
                        >
                            {this.story}
                        </Typography>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}