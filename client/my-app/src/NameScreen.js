import React from "react";
import FabIconButton from './FabIconButton'
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
//https://material.io/design/components/progress-indicators.html#linear-progress-indicators
import LinearProgress from '@material-ui/core/LinearProgress';

import { connect, onConnection, submitName } from './socketApi'

export default class NameScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            inputValidationError: true
          };
        connect();
        onConnection(() => {
            this.setState({
                isLoading: false
            })
        });
    }
    //TODO: find a validation library that can handle this
    onChange(event) {
        this.setState({ inputValidationError: true })
        var letters = /^[a-zA-Z]{1,30}$/;
        if (event.target.value.match(letters)) {
           this.setState(
                { 
                    inputValidationError: false,
                    name: event.target.value
                }
            )
           return;
        } 
        this.setState({ inputValidationError: true })     
    }

    render() {
        const  isLoading  = this.state.isLoading;
        const  inputValidationError  = this.state.inputValidationError;
        console.log(this.state.showScore)
        return (
            <React.Fragment>
                <Fade in={isLoading}>
                <div> 
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
                            connecting
                        </Typography>
                    </Grid>
                    <LinearProgress />
                </div>
                </Fade>
                <Fade in={!isLoading}>
                    <div>
                        <Grid
                            container
                            justify="center"
                            alignItems="center"
                        >
                        <TextField
                            required
                            error={inputValidationError}
                            id="outlined-required"
                            label="Name"
                            margin="normal"
                            variant="outlined"
                            style={{
                                marginTop: "40px"
                            }}
                            onChange={this.onChange.bind(this)}
                        />
                        </Grid>
                        <Grid
                            container
                            justify="center"
                            alignItems="center"
                        >
                        <Button
                            variant="contained"
                            color="primary"
                            style={{marginTop: 24, marginBottom: 10}}
                            onClick={()=>{
                                submitName(this.state.name);
                                this.props.changeScreen('FindingGameScreen');
                            }}
                            disabled={inputValidationError}
                        >
                            FIND GAME
                        </Button>
                        </Grid>
                    </div>
                    </Fade>
                <FabIconButton
                    position="right"
                    fontAwesomeIcon="fas fa-question"
                    onClick={ ()=>{ this.setState({showScore: true}) } }
                   
                />         
            </React.Fragment>
            
        );
    }
}

