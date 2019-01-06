import React from "react";
import HelpButton from './HelpButton'
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//https://material.io/design/components/progress-indicators.html#linear-progress-indicators
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import { onWritingTimerTick, submitWriting, onVotingStart, unsubscribeListener } from './socketApi'
import StoryDrawer from './StoryDrawer'

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
                            { isWritingSubmitted
                              ? "waiting for other players"
                              : writingTimeLeft ? writingTimeLeft  + " left to write" : "writing"
                            }
                        </Typography>
                    </Grid>
                    <LinearProgress 
                        variant={ isWritingSubmitted
                                  ? "indeterminate"
                                  : "determinate"
                                }
                        color={ isWritingSubmitted
                                ? "primary"
                                : "secondary"
                              }
                        value={ isWritingSubmitted
                                ? null
                                : (writingTimeLeft/totalWritingTime) * 100
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
                <HelpButton
                    position="right"
                    fontAwesomeIcon="fas fa-list-ol"
                    onClick={ ()=>{ alert('help') } }
                />
                <HelpButton
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
            </React.Fragment>
        );
    }
}
