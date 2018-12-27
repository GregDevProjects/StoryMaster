import React from 'react';
import ReactDOM from 'react-dom';
import SplashScreen from './SplashScreen'
import CssBaseline from '@material-ui/core/CssBaseline';
import NameScreen from './NameScreen';
import FindingGameScreen from './FindingGameScreen';
import WritingScreen from './WritingScreen';

const PAGES = {
    'SplashScreen' : SplashScreen,
    'NameScreen' : NameScreen,
    'FindingGameScreen' : FindingGameScreen,
    'WritingScreen' : WritingScreen
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentPage: PAGES['WritingScreen'] };
    }

    changeScreen(newPage) { 
        if (!PAGES[newPage]) {
            console.warn('newPage must be a key in PAGES');
            return;
        }
        this.setState({currentPage : PAGES[newPage]});
    }

    render() {
        const CurrentPage = this.state.currentPage;

        return (
            <React.Fragment>
                <CssBaseline />
                <CurrentPage changeScreen={this.changeScreen.bind(this)} />
            </React.Fragment>
        )
    }
}



ReactDOM.render(<App />, document.querySelector('#app'));