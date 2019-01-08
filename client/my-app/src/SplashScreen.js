import React from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FabIconButton from './FabIconButton'
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
                    quote : { 
                        content : response.content,
                        author : response.title 
                    }
                    
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
                    <Quote quote={this.state.quote}/>
                    </Grid>

                    <Typography
                        variant="button"
                    >
                    <Button
                        variant="contained"
                        color="primary"
                        style={{marginTop: 10, marginBottom: 10}}
                        onClick={()=>{
                            this.props.changeScreen('NameScreen');
                        }}
                    >
                        START
                    </Button>
                    </Typography>
                </Grid>
                <FabIconButton
                    position="right"
                    fontAwesomeIcon="fas fa-question"
                    onClick={ ()=>{ alert('help') } }
                />
            </React.Fragment>
        )
    }
}

function Quote(props) {
    if (!props.quote) {
      return "";
    }
    return <div> 
        <div>  
        <Typography 
            variant="body2"
            dangerouslySetInnerHTML={{__html: props.quote.content}}>   
        </Typography>
        </div>
        <Typography
            gutterBottom
            variant="body2"
            style={{fontStyle: "italic"}}
        >
        <i> -{props.quote.author}</i>
        </Typography>
    </div>
}