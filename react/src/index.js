import React from 'react';
import ReactDOM from 'react-dom';
import SplashScreen from './screens/SplashScreen'
import CssBaseline from '@material-ui/core/CssBaseline';
import NameScreen from './screens/NameScreen';
import FindingGameScreen from './screens/FindingGameScreen';
import WritingScreen from './screens/WritingScreen';
import VotingScreen from './screens/VotingScreen';
import RoundResultsScreen from './screens/RoundResultsScreen';
import GameOverScreen from './screens/GameOverScreen';
import ErrorScreen from './screens/ErrorScreen'
import StoryDrawer from './components/StoryDrawer';
import ScoreDrawer from './components/ScoreDrawer';
import FabIconButton from './components/FabIconButton';
import { onStoryResultUpdate, onGameOver, onWaitingForPlayersToContinueGame, connect, onLostConnectionToServer } from './socketApi';
import MetaTags from 'react-meta-tags';

const PAGES = {
    'SplashScreen' : SplashScreen,
    'NameScreen' : NameScreen,
    'FindingGameScreen' : FindingGameScreen,
    'WritingScreen' : WritingScreen,
    'VotingScreen' : VotingScreen,
    'RoundResultsScreen' : RoundResultsScreen,
    'GameOverScreen' : GameOverScreen,
    'ErrorScreen' : ErrorScreen
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            currentPage: PAGES['SplashScreen'],
            showStory: false,
            showScore: false
        };
    }

    startGlobalSocket() {
        connect();
        onStoryResultUpdate((story, score) => {
            this.setState({
                story: story,
                scores: score
            })
        });
        onGameOver((winner, story) => {
            this.changeScreen(
                'GameOverScreen', 
                {
                    winner: winner, 
                    story: story
                }
            );
            this.setState({
                story: "",
                scores: []
            });
        });
        onWaitingForPlayersToContinueGame(() => {
            this.changeScreen(
                'FindingGameScreen',
                {
                    storyWillContinue: true
                }
            )
        });
        onLostConnectionToServer(() => {
            this.changeScreen(
                'ErrorScreen'
            )
        });
    }

    changeScreen(newPage, otherProps) {
        console.log(newPage)
        if (!PAGES[newPage]) {
            console.warn('newPage must be a key in PAGES');
            return;
        }

        if (newPage === 'NameScreen') {
            this.startGlobalSocket();
        }

        this.setState(
            {
                currentPage: PAGES[newPage],
                currentPageProps: otherProps
            }
        );
    }

    getScoreAndStoryButtons() {
        return <React.Fragment>
            <FabIconButton
            position="right"
            fontAwesomeIcon="fas fa-user"
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
                story={this.state.story}
            ></StoryDrawer>
            <ScoreDrawer
                open={this.state.showScore}
                close={() => { this.setState({showScore: false})}}
                scores={this.state.scores}
            />
        </React.Fragment>
    }

    render() {
        const CurrentPage = this.state.currentPage;
        const currentPageProps = this.state.currentPageProps;
        const gameIsInProgress = (
            CurrentPage !== PAGES['NameScreen'] &&
            CurrentPage !== PAGES['SplashScreen'] &&
            CurrentPage !== PAGES['ErrorScreen']
        );
        return (
            <React.Fragment>
                <MetaTags>
                <title>test</title>
                <meta name="viewport" content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width"/>
                </MetaTags>
                <CssBaseline />
                <CurrentPage 
                    changeScreen={this.changeScreen.bind(this)} 
                    props={currentPageProps}
                    story={this.state.story}
                />
                { gameIsInProgress ? this.getScoreAndStoryButtons() : <div></div> }
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App />, document.querySelector('#app'));