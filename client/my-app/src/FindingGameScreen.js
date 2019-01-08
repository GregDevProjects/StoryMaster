import React from "react";
import FabIconButton from './FabIconButton'
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//https://material.io/design/components/progress-indicators.html#linear-progress-indicators
import LinearProgress from '@material-ui/core/LinearProgress';
import { onWaitingForPlayersToBeginGame, onGameStart, onWaitingForPlayersToContinueGame, onWritingStart, unsubscribeListener } from './socketApi'

const LOOKING_FOR_GAME = "looking for a game";
const WAITING_FOR_GAME_START = "game found, the story will begin after enough players join";
const WAITING_FOR_GAME_CONTINUE = "a player left, the story will continue after enough players join";
const GAME_STARTING = "game will begin shortly";

export default class FindingGameScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadingMessage: LOOKING_FOR_GAME
        };
    }

    componentDidMount() {
        onWaitingForPlayersToBeginGame(() => {
            this.setState({
                loadingMessage: WAITING_FOR_GAME_START
            })
        });
        onGameStart(() => {
            this.setState({
                loadingMessage: GAME_STARTING
            })      
        });
        onWaitingForPlayersToContinueGame(() => {
            this.setState({
                loadingMessage : WAITING_FOR_GAME_CONTINUE
            })
        });
        onWritingStart(() => {
            this.props.changeScreen('WritingScreen'); 
        })
    }

    componentWillUnmount() {
        unsubscribeListener('waiting');
        unsubscribeListener('writing');
    }

    render() {
        const  isLoading  = this.state.isLoading;
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
                            {this.state.loadingMessage}
                        </Typography>
                    </Grid>
                    <LinearProgress />
                </div>
                </Fade>
                <FabIconButton
                    position="right"
                    fontAwesomeIcon="fas fa-list-ol"
                    onClick={ ()=>{ alert('help') } }
                />
            </React.Fragment>
        );
    }
}
