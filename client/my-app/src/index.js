import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from './AppBar'
import SplashScreen from './SplashScreen'
import CssBaseline from '@material-ui/core/CssBaseline';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pages : {
                'SplashScreen' : SplashScreen
            },
            page : SplashScreen
        }

    }

    setSelectedPage = function(newPage) {
        // debugger;
        this.setState ({
            page : this.state.pages[newPage]
        })
    }.bind(this)

    render() {
        const $SelectedPage =  this.state.page;

        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar go={this.setSelectedPage}/>
                 <div style={{position: 'relative', top:'50px'}}>
                    <$SelectedPage />
                 </div>
            </React.Fragment>
        )
    }
}



ReactDOM.render(<App />, document.querySelector('#app'));