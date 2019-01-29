import React from "react";
import FabIconButton from '../components/FabIconButton'
import Fade from '@material-ui/core/Fade';
import { onWaitingForPlayersToBeginGame, onGameStart, roundStart, unsubscribeListener, onPlayersNeededToStartGame, onJoinedGameInProgress } from '../socketApi'
import StatusLoader from '../components/StatusLoader'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const LOOKING_FOR_GAME = "looking for a story";
const WAITING_FOR_GAME_START = "the story will begin after enough players join.";
const WAITING_FOR_GAME_CONTINUE = "a player left, the story will continue after enough players join.";
const GAME_STARTING = "story will begin shortly";
const GAME_IN_PROGRESS = "found a story, you will join after the round ends";

export default class FindingGameScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadingMessage: LOOKING_FOR_GAME,
            playersNeeded: false,
            story: false
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
        roundStart((roundsLeft, isFirstRound)=>{
            this.props.changeScreen('WritingScreen', {roundsLeft: roundsLeft, isFirstRound: isFirstRound});
        })

        onPlayersNeededToStartGame((amountNeeded) => {
            this.setState({playersNeeded: amountNeeded});
        });
        onJoinedGameInProgress((storySoFar) => {
            this.setState({
                loadingMessage: GAME_IN_PROGRESS,
                story: storySoFar
            })
        });

        if (this.storyWillContinue) {
            this.setState({loadingMessage: WAITING_FOR_GAME_CONTINUE});
        }
    }

    componentWillUnmount() {
        unsubscribeListener('waiting');
        unsubscribeListener('writing');
        unsubscribeListener('playersNeeded');
        unsubscribeListener('roundStart');
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
        const story = this.state.story;
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
                <Fade in={story ? true : false}>
                <Card
                    style={{width: "calc(100% - 20px)", marginLeft: "10px", marginRight: "10px", marginTop:"20px"}}
                >
                    <CardHeader
                        title="Story so far..."
                    />
                    <CardContent>
                        {story}
                    </CardContent>
                </Card>
                </Fade>
            </React.Fragment>
        );
    }
}
