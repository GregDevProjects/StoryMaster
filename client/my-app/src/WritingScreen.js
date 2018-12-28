import React from "react";
import HelpButton from './HelpButton'
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//https://material.io/design/components/progress-indicators.html#linear-progress-indicators
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import { onWritingTimerTick, submitWriting } from './socketApi'

const WRITING_TIME_TOTAL= 15;
const TEXT_INPUT_STYLE = {width: "calc(100% - 20px)", marginLeft: "10px", marginRight: "10px", marginTop:"40px"};

export default class WritingScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            writingTimeLeft: WRITING_TIME_TOTAL,
            isWritingSubmitted: false,
            writing: ""
        };
        onWritingTimerTick((countDownValue)=>
        { 
            this.setState({
                writingTimeLeft: countDownValue
            })
        });
    }

    render() {
        const writingTimeLeft = this.state.writingTimeLeft;
        const isWritingSubmitted = this.state.isWritingSubmitted;
        const writing = this.state.writing;
        console.log(writing);
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
                              : writingTimeLeft + " left to write"
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
                                : (writingTimeLeft/WRITING_TIME_TOTAL) * 100
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
                        value="orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.em Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.em Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
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
                                    console.log(event)
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
                <HelpButton/>
            </React.Fragment>
        );
    }
}
