import React from "react";
import HelpButton from './HelpButton'
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//https://material.io/design/components/progress-indicators.html#linear-progress-indicators
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { submitVote, onVotingTimerTick, onRoundResults } from './socketApi'


export default class RoundResults extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.props)
    }


    render() {

        return (
            <React.Fragment>
                <h1>ROUND RESULTS</h1>
                <HelpButton/>
            </React.Fragment>
        );
    }
}