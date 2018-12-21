import React from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

import './index.css';

export default class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1';
        fetch(proxyUrl + targetUrl, {
            method: 'get', 
        }).then((response) => {
            console.log(response)
            //sometimes the response doesn't get returned as json
            response.json().then((resolved) => {
                console.log(resolved)
                const response = resolved[0];
                this.setState({
                    quote : response.content, 
                    author : response.title
                });
            });
            
        }).then(function(data) {
            console.log('2nd', data)
        });

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
                        { 
                            this.state.isLoading ? 
                            <LoadingSpinner></LoadingSpinner> : 
                            <div> 
                                <div dangerouslySetInnerHTML={{ __html: this.state.quote }} />  
                                <i> -{this.state.author}</i>
                            </div>
                        }
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

