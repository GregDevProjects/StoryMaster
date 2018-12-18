import React from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import getRandomQuote from 'get-random-quote';

import request from 'request-promise';
import escapeJson from 'escape-json-node';

import './index.css';

export default class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }

        fetch('http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en', {
            method: 'get', 
        }).then((response) => {
            //sometimes the response doesn't get returned as json
            response.json().then((resolved) => {
                this.setState({
                    quoteText : resolved.quoteText, 
                    quoteAuthor : resolved.quoteAuthor
                });
            });
            
        }).then(function(data) {
            console.log('2nd', data)
        });

    }

    formatQuote(quote, author) {
        if (!quote) {
            return;
        }
        return <div> 
            <div>
                "{quote}"
            </div>
            <i> -{author}</i>
        </div>
    }

    render() {


        return (
            <div>
                <Grid
                    container
                    justify="center"
                    alignItems="center"

                >
                    <Grid 
                        item 
                        style={{textAlign: 'center'}}
                        xs={12}
                    >
                        <h1>Story Master</h1>
                    </Grid>
                    <Grid 
                        item 
                        style={{textAlign: 'center'}}
                        xs={12}
                    >
                        { this.state.isLoading ? <LoadingSpinner></LoadingSpinner> : this.formatQuote(this.state.quoteText, this.state.quoteAuthor ) }
                    </Grid>

                   
                    <Button
                        variant="contained"
                        color="primary"
                        style={{marginTop: 10, marginBottom: 10}}
                        onClick={()=>{
                            this.setState({isLoading: true})
                        }}
                    >
                        Get STARted
                        <Icon> star</Icon>
                    </Button>


                </Grid>


            </div>
        )
    }


}

function GameDescrption() {
    let quoteText = 'first';



    return <div>
        {quoteText}
    </div>
}


class LoadingSpinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loadingText: 'Initial Text'
        }

    }

    simulateLoadingEvents() {
        setTimeout(
            function() {
                this.setState({
                    loadingText: 'Updated Text'
                })

            }.bind(this), 2000
        );
    }


    render() {
        this.simulateLoadingEvents();
        return (
            <div>
                    <CircularProgress
                        size={80}
                    />
                <div
                    style={{marginTop: 30}}
                >
                    {this.state.loadingText}
                </div>
            </div>
        )
    }
//TODO: show people joining the game 
}

