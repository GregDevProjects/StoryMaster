import React from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import HelpButton from './HelpButton'
import Typography from '@material-ui/core/Typography';


import './index.css';

export default class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {quote : null}
        this.displayRandomQuote();
    }

    displayRandomQuote() {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1';
        fetch(proxyUrl + targetUrl, {
            method: 'get', 
        }).then((response) => {
            response.json().then((resolved) => {
                const response = resolved[0];
                this.setState({
                    quote : response.content, 
                    author : response.title
                });
            });
            
        }).then(function(data) {
            if (data) {
                console.warn(data)
            }
        });
    }



    render() {
        return (
            <React.Fragment>
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
                        <Typography 
                            variant="h1"
                            style={{fontSize:"85px"}}
                            gutterBottom
                        >
                            Story Master
                        </Typography>
                    </Grid>
                    <Grid 
                        item 
                        style={{textAlign: 'center'}}
                        xs={12}
                    >
                        { this.state.quote &&
                            <div> 
                                <div>  
                                <Typography 
                                    variant="body2"
                                    dangerouslySetInnerHTML={{__html: this.state.quote}}>   
                                </Typography>
                                </div>
                                <Typography
                                    gutterBottom
                                    variant="body2"
                                    style={{fontStyle: "italic"}}
                                >
                                <i> -{this.state.author}</i>
                                </Typography>
                            </div>
                        }
                    </Grid>

                    <Typography
                        variant="button"
                    >
                    <Button
                        variant="contained"
                        color="primary"
                        style={{marginTop: 10, marginBottom: 10}}
                        onClick={()=>{
                            this.props.changePage('NameScreen');
                        }}
                    >
                        START
                    </Button>
                    </Typography>
                </Grid>
                <HelpButton/>
               
            </React.Fragment>
        )
    }


}