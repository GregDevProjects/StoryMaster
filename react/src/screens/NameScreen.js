import React from "react";
import FabIconButton from '../components/FabIconButton'
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import StatusLoader from '../components/StatusLoader';
import HelpDialog from '../components/HelpDialog';

import { onConnection, submitName, unsubscribeListener } from '../socketApi'

export default class NameScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isValidInput: false,
            showHelp: false
          };
        
        onConnection(() => {
            this.setState({
                isLoading: false              
            })
        });
    }
    //TODO: find a validation library that can handle this
    onChange(event) {
        this.setState({ isValidInput: false })
        var letters = /^[a-zA-Z]{1,30}$/;
        if (event.target.value.match(letters)) {
           this.setState(
                { 
                    isValidInput: true,
                    name: event.target.value
                }
            )
           return;
        } 
        this.setState({ isValidInput: false })     
    }

    componentWillMount() {
        document.addEventListener("keyup", this._handleKeyPress, false);
    }

    componentWillUnmount(){
        unsubscribeListener('waiting');
        document.removeEventListener("keyup", this._handleKeyPress, false);
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter' && this.state.isValidInput) {
            this.submitNameAndFindGame();
        }
    }
    submitNameAndFindGame() {
        submitName(this.state.name);
        this.props.changeScreen('FindingGameScreen');    
    }

    render() {
        const  isLoading  = this.state.isLoading;
        const  isValidInput  = this.state.isValidInput;
        return (
            <React.Fragment>
                <Fade in={isLoading}>
                <div> 
                    <StatusLoader
                        text="connecting"
                    />
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
                            error={!isValidInput}
                            label="Name"
                            margin="normal"
                            variant="outlined"
                            style={{
                                marginTop: "40px"
                            }}
                            onChange={this.onChange.bind(this)}
                            autoFocus={true}
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
                                this.submitNameAndFindGame();
                            }}
                            disabled={!isValidInput}
                        >
                            FIND GAME
                        </Button>
                        </Grid>
                    </div>
                    </Fade>
                <FabIconButton
                    position="right"
                    fontAwesomeIcon="fas fa-question"
                    onClick={ ()=>{ this.setState({showHelp: true}) } }
                   
                />
                <HelpDialog
                    open={this.state.showHelp}
                    close={() => { this.setState({showHelp: false})}}
                />   
            </React.Fragment>
            
        );
    }
}

