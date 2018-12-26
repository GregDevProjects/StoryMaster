import React from 'react';
import ReactDOM from 'react-dom';
import SplashScreen from './SplashScreen'
import CssBaseline from '@material-ui/core/CssBaseline';
import NameScreen from './NameScreen';

const PAGES = {
    'SplashScreen' : SplashScreen,
    'NameScreen' : NameScreen
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentPage: PAGES['SplashScreen'] };
    }

    changePage(newPage) { 
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
                <CurrentPage changePage={this.changePage.bind(this)} />
            </React.Fragment>
        )
    }
}



ReactDOM.render(<App />, document.querySelector('#app'));