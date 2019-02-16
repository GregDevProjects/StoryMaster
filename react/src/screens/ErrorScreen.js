import React from "react";
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

export default class FindingGameScreen extends React.Component {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        loadCSS(
          'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
          document.querySelector('#insertion-point-jss'),
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Typography
                    variant="h3"
                    gutterBottom
                    style={{textAlign: "center"}}
                >
                There was a problem connecting to the server.
                </Typography>
                <Typography
                    variant="h5"
                    gutterBottom
                    style={{textAlign: "center"}}
                >
                Try refreshing the page, if the problem persists the server might be down.
                </Typography>
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
                        <Icon
                            className={'fas fa-bug'} 
                            color="error"
                            style={{fontSize: "130px"}}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
