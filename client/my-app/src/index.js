import React from 'react';
import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';
import AppBar from './AppBar'
import HelloWorld from './HelloWorld'
import PeopleContainer from './PeopleContainer'
import SplashScreen from './SplashScreen'

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pages : {
                'HelloWorld' : HelloWorld,
                'PeopleContainer' : PeopleContainer,
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
            <div>
                <AppBar go={this.setSelectedPage}/>
                 <div style={{position: 'relative', top:'50px'}}>
                    <$SelectedPage />
                 </div>
            </div>
        )
    }
}



ReactDOM.render(<App />, document.querySelector('#app'));