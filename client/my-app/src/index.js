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
import { onStoryResultUpdate, onGameOver, onWaitingForPlayersToContinueGame } from './socketApi';

const PAGES = {
    'SplashScreen' : SplashScreen,
    'NameScreen' : NameScreen,
    'FindingGameScreen' : FindingGameScreen,
    'WritingScreen' : WritingScreen,
    'VotingScreen' : VotingScreen,
    'RoundResultsScreen' : RoundResultsScreen,
    'GameOverScreen' : GameOverScreen
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            currentPage: PAGES['NameScreen'] 
        };
        this.story = "";
    }

    componentDidMount() {
        if (this.state.currentPage === PAGES['SplashScreen']) {
            return;
        }
        onStoryResultUpdate((story, score) => {
            console.log('story update received');
            this.scores = score;
            this.story = story;
        });
        onGameOver((winner, story) => {
            this.changeScreen(
                'GameOverScreen', 
                {
                    winner: winner, 
                    story: story
                }
            )
        });
        onWaitingForPlayersToContinueGame(() => {
            this.changeScreen(
                'FindingGameScreen',
                {
                    storyWillContinue: true
                }
            )
        })
    }

    changeScreen(newPage, otherProps) { 
        if (!PAGES[newPage]) {
            console.warn('newPage must be a key in PAGES');
            return;
        }

        this.setState(
            {
                currentPage: PAGES[newPage],
                currentPageProps: otherProps
            }
        );
    }

    render() {
        const CurrentPage = this.state.currentPage;
        const currentPageProps = this.state.currentPageProps;
        return (
            <React.Fragment>
                <CssBaseline />
                <CurrentPage 
                    story={this.story} 
                    scores={this.scores}
                    changeScreen={this.changeScreen.bind(this)} 
                    props={currentPageProps}
                />
            </React.Fragment>
        )
    }
}



ReactDOM.render(<App />, document.querySelector('#app'));