import React from 'react';
import ReactDOM from 'react-dom';
import SplashScreen from './SplashScreen'
import CssBaseline from '@material-ui/core/CssBaseline';
import NameScreen from './NameScreen';
import FindingGameScreen from './FindingGameScreen';
import WritingScreen from './WritingScreen';
import VotingScreen from './VotingScreen';
import RoundResultsScreen from './RoundResultsScreen';
import { onStoryResultUpdate, waiting } from './socketApi';

const PAGES = {
    'SplashScreen' : SplashScreen,
    'NameScreen' : NameScreen,
    'FindingGameScreen' : FindingGameScreen,
    'WritingScreen' : WritingScreen,
    'VotingScreen' : VotingScreen,
    'RoundResultsScreen' : RoundResultsScreen
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
        onStoryResultUpdate((story, score) => {
            this.scores = score;
            this.story = story;
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