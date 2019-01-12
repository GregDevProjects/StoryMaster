import React from "react";
import FabIconButton from '../components/FabIconButton'
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { onWritingTimerTick, submitWriting, onVotingStart, unsubscribeListener } from '../socketApi'
import StoryDrawer from '../components/StoryDrawer'
import ScoreDrawer from '../components/ScoreDrawer'

import StatusLoader from '../components/StatusLoader'

const TEXT_INPUT_STYLE = {width: "calc(100% - 20px)", marginLeft: "10px", marginRight: "10px", marginTop:"40px"};

export default class WritingScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isWritingSubmitted: false,
            writing: "",
            showStory: false
        };
        this.story = props.story;
        this.scores = props.scores;
    }

    componentDidMount() {
        onWritingTimerTick((countDownValue, totalSeconds) => { 
            this.setState({
                writingTimeLeft: countDownValue,
                totalWritingTime: totalSeconds
            })
        });
        onVotingStart((results) => {
            this.props.changeScreen('VotingScreen', {votes: results});
        });
    }

    componentWillUnmount() {
        unsubscribeListener('turnTimer');
        unsubscribeListener('vote');
    }

    render() {
        const writingTimeLeft = this.state.writingTimeLeft;
        const totalWritingTime = this.state.totalWritingTime;
        const isWritingSubmitted = this.state.isWritingSubmitted;
        const writing = this.state.writing;
        return (
            <React.Fragment>
                    <StatusLoader
                        variant={ isWritingSubmitted
                            ? "indeterminate"
                            : "determinate"
                          }
                        color={ isWritingSubmitted
                                ? "primary"
                                : "secondary"
                                }
                        percentComplete={ isWritingSubmitted
                                ? null
                                : (writingTimeLeft/totalWritingTime)
                                }
                        text={ isWritingSubmitted
                                ? "waiting for other players"
                                : writingTimeLeft ? writingTimeLeft  + " left to write" : "writing"
                                }
                    />
                    <TextField
                        disabled
                        label="Story so far..."
                        margin="normal"
                        variant="outlined"
                        style={ TEXT_INPUT_STYLE }
                        multiline
                        rowsMax="8"
                        value={ this.story }
                    />
                    <Fade 
                        in={!isWritingSubmitted}
                    >
                        <div>
                            <TextField
                                label="What comes next?"
                                margin="normal"
                                variant="outlined"
                                style={ TEXT_INPUT_STYLE }
                                multiline
                                rowsMax="4"
                                onChange={ (event) => {
                                    this.setState({
                                        writing: event.target.value
                                    })
                                } }
                            />
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: 24, marginBottom: 10 }}
                                    onClick={()=>{
                                        this.setState({
                                            isWritingSubmitted: true
                                        })
                                        submitWriting(writing);
                                    }}
                                >
                                    SUBMIT
                                </Button>
                            </Grid>                     
                        </div>
                    </Fade>
                <FabIconButton
                    position="right"
                    fontAwesomeIcon="fas fa-list-ol"
                    onClick={ ()=>{ this.setState({showScore: true}) } }
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
                />
                <ScoreDrawer
                    open={this.state.showScore}
                    close={() => { this.setState({showScore: false})}}
                    scores={this.scores}
                />

            </React.Fragment>
        );
    }
}
