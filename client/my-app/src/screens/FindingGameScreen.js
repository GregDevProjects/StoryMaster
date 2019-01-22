import React from "react";
import FabIconButton from '../components/FabIconButton'
import Fade from '@material-ui/core/Fade';
import { onWaitingForPlayersToBeginGame, onGameStart, onWritingStart, unsubscribeListener, onPlayersNeededToStartGame } from '../socketApi'
import StatusLoader from '../components/StatusLoader'

const LOOKING_FOR_GAME = "looking for a game";
const WAITING_FOR_GAME_START = "the story will begin after enough players join.";
const WAITING_FOR_GAME_CONTINUE = "a player left, the story will continue after enough players join.";
const GAME_STARTING = "game will begin shortly";

export default class FindingGameScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadingMessage: LOOKING_FOR_GAME,
            playersNeeded: false
        };

        if (props.props && props.props.storyWillContinue) {
            this.storyWillContinue = props.props.storyWillContinue;
        }
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
        onWritingStart(() => {
            this.props.changeScreen('WritingScreen'); 
        });
        onPlayersNeededToStartGame((amountNeeded) => {
            this.setState({playersNeeded: amountNeeded});
        });

        if (this.storyWillContinue) {
            this.setState({loadingMessage: WAITING_FOR_GAME_CONTINUE});
        }
    }

    componentWillUnmount() {
        unsubscribeListener('waiting');
        unsubscribeListener('writing');
        unsubscribeListener('playersNeeded');
    }

    getProgressText() {
        const playersNeeded = this.state.playersNeeded;
        if (!playersNeeded) {
            return this.state.loadingMessage;
        }

        if (this.storyWillContinue) {
            return playersNeeded + " player(s) needed to continue the story";
        }

        return playersNeeded + " player(s) needed to start the story";
    }

    render() {
        const isLoading  = this.state.isLoading;

        return (
            <React.Fragment>
                <Fade in={isLoading}>
                <div> 
                    <StatusLoader
                        text={this.getProgressText()}
                    />
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
